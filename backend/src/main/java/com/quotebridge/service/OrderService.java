package com.quotebridge.service;

import com.quotebridge.domain.entity.*;
import com.quotebridge.domain.enums.OrderStatus;
import com.quotebridge.domain.enums.QuoteStatus;
import com.quotebridge.dto.order.CreateOrderRequestDto;
import com.quotebridge.dto.order.OrderDto;
import com.quotebridge.dto.order.OrderItemDto;
import com.quotebridge.dto.quotation.QuotationResponseDto.SupplierContactDto;
import com.quotebridge.exception.ResourceNotFoundException;
import com.quotebridge.repository.OrderRepository;
import com.quotebridge.repository.QuotationRequestRepository;
import com.quotebridge.repository.SupplierQuotationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final QuotationRequestRepository quotationRequestRepository;
    private final SupplierQuotationRepository supplierQuotationRepository;

    public OrderService(OrderRepository orderRepository,
                        QuotationRequestRepository quotationRequestRepository,
                        SupplierQuotationRepository supplierQuotationRepository) {
        this.orderRepository = orderRepository;
        this.quotationRequestRepository = quotationRequestRepository;
        this.supplierQuotationRepository = supplierQuotationRepository;
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequestDto dto, User currentUser) {
        QuotationRequest quote = quotationRequestRepository.findById(dto.getQuoteId())
                .or(() -> quotationRequestRepository.findByRfqNumber(dto.getQuoteId()))
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found: " + dto.getQuoteId()));

        SupplierQuotation response = supplierQuotationRepository.findById(dto.getResponseId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier quotation response not found: " + dto.getResponseId()));

        // Check if an order already exists for this quotation and response
        Optional<Order> existingOrder = orderRepository.findByQuotationRequestIdAndSupplierQuotationId(quote.getId(), response.getId());
        if (existingOrder.isPresent()) {
            return mapToDto(existingOrder.get());
        }

        String orderId = "order-" + UUID.randomUUID().toString().substring(0, 8);
        int randomSuffix = 1000 + new Random().nextInt(9000);
        String orderNumber = "#PO-2024-" + randomSuffix;

        Order order = new Order();
        order.setId(orderId);
        order.setOrderNumber(orderNumber);
        order.setQuotationRequest(quote);
        order.setSupplierQuotation(response);
        order.setBuyerOrganization(quote.getBuyerOrganization());
        order.setSupplierName(dto.getSupplierName() != null ? dto.getSupplierName() : response.getSupplierName());
        order.setContactName(response.getContactName());
        order.setContactRole(response.getContactRole());
        order.setContactEmail(response.getContactEmail());
        order.setContactPhone(response.getContactPhone());
        order.setBusinessName(dto.getBusinessName() != null ? dto.getBusinessName() : quote.getBusinessName());
        order.setDeliveryLocation(dto.getDeliveryLocation() != null ? dto.getDeliveryLocation() : quote.getDeliveryLocation());

        OffsetDateTime now = OffsetDateTime.now();
        order.setConfirmedDate(now.format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
        order.setExpectedDelivery(dto.getExpectedDelivery() != null ? dto.getExpectedDelivery() :
                now.plusDays(response.getEstDeliveryDays() != null ? response.getEstDeliveryDays() : 3).format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
        order.setShippingRoute(dto.getShippingRoute() != null ? dto.getShippingRoute() : response.getShippingRoute());

        // Process items
        List<OrderItem> orderItems = new ArrayList<>();
        int totalUnits = 0;
        BigDecimal calculatedSubtotal = BigDecimal.ZERO;

        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            for (OrderItemDto itemDto : dto.getItems()) {
                String itemId = "oi-" + UUID.randomUUID().toString().substring(0, 8);
                BigDecimal qty = itemDto.getQuantity() != null ? itemDto.getQuantity() : BigDecimal.ONE;
                BigDecimal unitPrice = itemDto.getUnitPrice() != null ? itemDto.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal itemConfirmedPrice = itemDto.getConfirmedPrice() != null ? itemDto.getConfirmedPrice() : unitPrice.multiply(qty);

                totalUnits += qty.intValue();
                calculatedSubtotal = calculatedSubtotal.add(itemConfirmedPrice);

                OrderItem oi = new OrderItem(
                        itemId,
                        order,
                        itemDto.getDescription() != null ? itemDto.getDescription() : "Item " + itemId,
                        qty,
                        unitPrice,
                        itemConfirmedPrice
                );
                orderItems.add(oi);
            }
        } else if (quote.getItems() != null) {
            // Build from quote items & response items
            for (QuotationItem qi : quote.getItems()) {
                String itemId = "oi-" + UUID.randomUUID().toString().substring(0, 8);
                BigDecimal unitPrice = BigDecimal.ZERO;

                if (response.getItems() != null) {
                    unitPrice = response.getItems().stream()
                            .filter(i -> i.getProductId().equalsIgnoreCase(qi.getId()) || i.getProductId().equalsIgnoreCase(qi.getProductName()))
                            .map(SupplierQuotationItem::getUnitPrice)
                            .findFirst().orElse(BigDecimal.ZERO);
                }

                BigDecimal itemConfirmedPrice = unitPrice.multiply(qi.getQuantity());
                totalUnits += qi.getQuantity().intValue();
                calculatedSubtotal = calculatedSubtotal.add(itemConfirmedPrice);

                OrderItem oi = new OrderItem(
                        itemId,
                        order,
                        qi.getProductName(),
                        qi.getQuantity(),
                        unitPrice,
                        itemConfirmedPrice
                );
                orderItems.add(oi);
            }
        }

        order.setItems(orderItems);
        order.setTotalUnits(dto.getTotalUnits() != null ? dto.getTotalUnits() : totalUnits);

        BigDecimal subtotal = dto.getTotalCost() != null ? dto.getTotalCost() :
                (response.getTotalAmount() != null && response.getTotalAmount().compareTo(BigDecimal.ZERO) > 0 ? response.getTotalAmount() : calculatedSubtotal);
        BigDecimal tax = dto.getTaxAmount() != null ? dto.getTaxAmount() : subtotal.multiply(new BigDecimal("0.05")).setScale(2, java.math.RoundingMode.HALF_UP);
        order.setTotalCost(subtotal);
        order.setTaxAmount(tax);
        order.setStatus(OrderStatus.Confirmed);

        Order saved = orderRepository.save(order);

        // Update Quote Request status to Accepted
        quote.setStatus(QuoteStatus.Accepted);
        quote.setSelectedSupplierId(response.getSupplier() != null ? response.getSupplier().getId() : null);
        quote.setSelectedResponseId(response.getId());
        quote.setUpdatedAt(OffsetDateTime.now());
        quotationRequestRepository.save(quote);

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .or(() -> orderRepository.findByOrderNumber(orderId))
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        return mapToDto(order);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderByQuoteId(String quoteId) {
        Order order = orderRepository.findByQuotationRequestId(quoteId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found for quotation: " + quoteId));
        return mapToDto(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> getOrders(OrderStatus status, Pageable pageable) {
        Page<Order> page;
        if (status != null) {
            page = orderRepository.findByStatus(status, pageable);
        } else {
            page = orderRepository.findAll(pageable);
        }
        return page.map(this::mapToDto);
    }

    public OrderDto mapToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setQuoteId(order.getQuotationRequest() != null ? order.getQuotationRequest().getId() : null);
        dto.setRfqNumber(order.getQuotationRequest() != null ? order.getQuotationRequest().getRfqNumber() : null);
        dto.setResponseId(order.getSupplierQuotation() != null ? order.getSupplierQuotation().getId() : null);
        dto.setSupplierName(order.getSupplierName());
        dto.setSupplierContact(new SupplierContactDto(
                order.getContactName(),
                order.getContactRole(),
                order.getContactEmail(),
                order.getContactPhone()
        ));
        dto.setBusinessName(order.getBusinessName());
        dto.setDeliveryLocation(order.getDeliveryLocation());
        dto.setConfirmedDate(order.getConfirmedDate());
        dto.setExpectedDelivery(order.getExpectedDelivery());
        dto.setShippingRoute(order.getShippingRoute());
        dto.setTotalCost(order.getTotalCost());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setTotalUnits(order.getTotalUnits());
        dto.setStatus(order.getStatus());

        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(i -> new OrderItemDto(
                    i.getDescription(),
                    i.getQuantity(),
                    i.getUnitPrice(),
                    i.getConfirmedPrice()
            )).collect(Collectors.toList()));
        }

        return dto;
    }
}
