package com.otabek.e_commerce_backend;

import com.otabek.e_commerce_backend.dto.request.*;
import com.otabek.e_commerce_backend.dto.response.CategoryResponseDTO;
import com.otabek.e_commerce_backend.entity.Category;
import com.otabek.e_commerce_backend.repository.CategoryRepository;
import com.otabek.e_commerce_backend.service.CategoryService;
import com.otabek.e_commerce_backend.service.OrderService;
import com.otabek.e_commerce_backend.service.ProductService;
import com.otabek.e_commerce_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DateSeeder implements CommandLineRunner {
    private final UserService userService;
    private final ProductService productService;
    private final OrderService orderService;
    private final CategoryService categoryService;

    @Override
    public void run(String... args) throws Exception {
        if (userService.getAll().isEmpty()){
            UserRequestDTO userReq1 = UserRequestDTO.builder()
                    .firstName("Otabek")
                    .lastName("Abdumalikov")
                    .phone("+998972850385")
                    .email("otabek@abdumalikov.com")
                    .username("abd11malikov")
                    .password("otabek2006").build();

            UserRequestDTO userReq2 = UserRequestDTO.builder()
                    .firstName("Oybek")
                    .lastName("Abdumalikov")
                    .phone("+998972840385")
                    .email("oybek@abdumalikov.com")
                    .username("abdumalikov11")
                    .password("oybek2007").build();

            UserRequestDTO userReq3 = UserRequestDTO.builder()
                    .firstName("Ozodbek")
                    .lastName("Abdumalikov")
                    .phone("+998772850385")
                    .email("ozodbek@abdumalikov.com")
                    .username("abdumalikov22")
                    .password("ozodbek2007").build();



            userService.create(userReq1);
            userService.create(userReq2);
            userService.create(userReq3);
            userService.promoteToAdmin(1);
            CategoryRequestDTO categoryRequestDTO = new CategoryRequestDTO();
            categoryRequestDTO.setName("Electronics");
            CategoryResponseDTO categoryResponseDTO = categoryService.create(categoryRequestDTO);

            ProductRequestDTO p1 = new ProductRequestDTO(
                    "MacBook Pro M3",
                    "Super fast laptop",
                    10,
                    "https://avatars.mds.yandex.net/get-mpic/17392064/2a00000198d2329fc0a4713b9d03063c3071/optimize",
                    new BigDecimal("2500.00"),
                    categoryResponseDTO.getId()
            );

            ProductRequestDTO p2 = new ProductRequestDTO(
                    "Wireless Mouse",
                    "Clicky clicky",
                    50,
                    "http://img.com/mouse",
                    new BigDecimal("25.50"),
                    categoryResponseDTO.getId()
            );


            Long prod1Id = productService.create(p1).getId();
            Long prod2Id = productService.create(p2).getId();

            OrderRequestDTO order = new OrderRequestDTO();
            order.setUserId(1);

            OrderItemRequestDTO item1 = new OrderItemRequestDTO();
            item1.setProductId(prod1Id);
            item1.setQuantity(1);

            OrderItemRequestDTO item2 = new OrderItemRequestDTO();
            item2.setProductId(prod2Id);
            item2.setQuantity(2);

            order.setOrderItems(List.of(item1, item2));

            orderService.placeOrder(userReq1.getEmail(), order);
        }

    }
}
