package com.otabek.nexus;

import com.otabek.nexus.dto.request.*;
import com.otabek.nexus.dto.response.CategoryResponseDTO;
import com.otabek.nexus.service.CategoryService;
import com.otabek.nexus.service.OrderService;
import com.otabek.nexus.service.ProductService;
import com.otabek.nexus.service.UserService;
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

            CategoryRequestDTO electronicsCategory = new CategoryRequestDTO();
            electronicsCategory.setName("Electronics");
            CategoryResponseDTO electronicsCat = categoryService.create(electronicsCategory);

            CategoryRequestDTO clothingCategory = new CategoryRequestDTO();
            clothingCategory.setName("Clothing");
            CategoryResponseDTO clothingCat = categoryService.create(clothingCategory);

            CategoryRequestDTO booksCategory = new CategoryRequestDTO();
            booksCategory.setName("Books");
            CategoryResponseDTO booksCat = categoryService.create(booksCategory);

            CategoryRequestDTO homeGardenCategory = new CategoryRequestDTO();
            homeGardenCategory.setName("Home & Garden");
            CategoryResponseDTO homeGardenCat = categoryService.create(homeGardenCategory);

            CategoryRequestDTO sportsCategory = new CategoryRequestDTO();
            sportsCategory.setName("Sports");
            CategoryResponseDTO sportsCat = categoryService.create(sportsCategory);

            ProductRequestDTO p1 = new ProductRequestDTO(
                    "MacBook Pro M3",
                    "Super fast laptop with M3 chip",
                    10,
                    "https://avatars.mds.yandex.net/get-mpic/17392064/2a00000198d2329fc0a4713b9d03063c3071/optimize",
                    new BigDecimal("2500.00"),
                    electronicsCat.getId()
            );

            ProductRequestDTO p2 = new ProductRequestDTO(
                    "Wireless Mouse",
                    "Ergonomic wireless mouse with long battery life",
                    50,
                    "https://i0.wp.com/chinthanagsm.lk/wp-content/uploads/2024/12/Ugreen-4000dpi-wireless-mouse.jpg?fit=1000%2C1000&ssl=1",
                    new BigDecimal("25.50"),
                    electronicsCat.getId()
            );

            ProductRequestDTO p3 = new ProductRequestDTO(
                    "Smartphone",
                    "Latest model smartphone with advanced features",
                    25,
                    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1255&q=80",
                    new BigDecimal("899.99"),
                    electronicsCat.getId()
            );

            ProductRequestDTO p4 = new ProductRequestDTO(
                    "Designer T-Shirt",
                    "Comfortable cotton t-shirt with unique design",
                    100,
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    new BigDecimal("29.99"),
                    clothingCat.getId()
            );

            ProductRequestDTO p5 = new ProductRequestDTO(
                    "Winter Jacket",
                    "Warm jacket for cold weather",
                    40,
                    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
                    new BigDecimal("129.95"),
                    clothingCat.getId()
            );

            ProductRequestDTO p6 = new ProductRequestDTO(
                    "Bestselling Novel",
                    "Award-winning fiction novel",
                    75,
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
                    new BigDecimal("19.99"),
                    booksCat.getId()
            );

            ProductRequestDTO p7 = new ProductRequestDTO(
                    "Indoor Plant",
                    "Low maintenance plant for your home",
                    60,
                    "https://tgfiles.oxapp.io/cache/original/image/67/c2/a4/67c2a49fbd41476f4662eab27c66753e888451f1fd12816166659158e74808b6.png",
                    new BigDecimal("34.99"),
                    homeGardenCat.getId()
            );

            ProductRequestDTO p8 = new ProductRequestDTO(
                    "Fitness Tracker",
                    "Track your workouts and health metrics",
                    85,
                    "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1115&q=80",
                    new BigDecimal("79.95"),
                    sportsCat.getId()
            );

            // Create orders for the first user
            Long prod1Id = productService.create(p1).getId();
            Long prod2Id = productService.create(p2).getId();
            Long prod3Id = productService.create(p3).getId();
            Long prod4Id = productService.create(p4).getId();
            Long prod5Id = productService.create(p5).getId();
            Long prod6Id = productService.create(p6).getId();
            Long prod7Id = productService.create(p7).getId();
            Long prod8Id = productService.create(p8).getId();

            OrderRequestDTO order = new OrderRequestDTO();
            order.setUserId(1);

            OrderItemRequestDTO item1 = new OrderItemRequestDTO();
            item1.setProductId(prod1Id);
            item1.setQuantity(1);

            OrderItemRequestDTO item2 = new OrderItemRequestDTO();
            item2.setProductId(prod2Id);
            item2.setQuantity(2);

            OrderItemRequestDTO item3 = new OrderItemRequestDTO();
            item3.setProductId(prod4Id);
            item3.setQuantity(3);

            order.setOrderItems(List.of(item1, item2, item3));

            orderService.placeOrder(userReq1.getEmail(), order);
        }

    }
}