package com.quotebridge.controller;

import com.quotebridge.domain.entity.User;
import com.quotebridge.domain.enums.OrderStatus;
import com.quotebridge.dto.common.ApiResponse;
import com.quotebridge.dto.order.CreateOrderRequestDto;
import com.quotebridge.dto.order.OrderDto;
import com.quotebridge.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Orders", description = "Endpoints for purchase orders, confirmation, and tracking")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Create and confirm a purchase order from an accepted quotation")
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @Valid @RequestBody CreateOrderRequestDto request,
            @AuthenticationPrincipal User currentUser
    ) {
        OrderDto created = orderService.createOrder(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Purchase order confirmed successfully", created));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by order ID or order number")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable String id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Order details retrieved", order));
    }

    @GetMapping("/by-quote/{quoteId}")
    @Operation(summary = "Get order details for a specific quotation request")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderByQuoteId(@PathVariable String quoteId) {
        OrderDto order = orderService.getOrderByQuoteId(quoteId);
        return ResponseEntity.ok(ApiResponse.success("Order for quotation retrieved", order));
    }

    @GetMapping
    @Operation(summary = "Get all purchase orders with optional status filter")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size
    ) {
        Page<OrderDto> ordersPage = orderService.getOrders(
                status,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", ordersPage.getContent()));
    }
}
