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

        if(userService.getAll().isEmpty()) {

            UserRequestDTO userReq1 = UserRequestDTO.builder()
                    .firstName("Otabek")
                    .lastName("Abdumalikov")
                    .phone("+998972850385")
                    .email("otabekabd11malikov@gmail.com")
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
                    "Gaming Keyboard",
                    "Mechanical gaming keyboard with RGB lighting",
                    40,
                    "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ9ieL3-6r__qzv_7K30YAxab6JlVT8674uY7m_WsC1pKtJuwbkCmmHZlErUAYbo-OagZDJo8Mn&usqp=CAc",
                    new BigDecimal("89.99"),
                    1L  // Electronics category
            );

            ProductRequestDTO p2 = new ProductRequestDTO(
                    "Running Shorts",
                    "Breathable moisture-wicking running shorts",
                    75,
                    "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQjCL4AVm8DWGzE25AlImucBiRqy4ewOT7PwKVgEwOI6DzG9fkcglnd7Q56IZdpE-7hNzriID-sg8U99IjL8xVJSD4encdSiFMF7X4Y1-4Q&usqp=CAc",
                    new BigDecimal("34.99"),
                    2L  // Clothing category
            );

            ProductRequestDTO p3 = new ProductRequestDTO(
                    "Cooking Recipe Book",
                    "Collection of gourmet recipes from world cuisines",
                    50,
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTcEiaVcT81wQv8CGcxjTeaTGmz4pxZZB6A&s",
                    new BigDecimal("22.99"),
                    3L  // Books category
            );

            ProductRequestDTO p4 = new ProductRequestDTO(
                    "Outdoor Grill",
                    "Gas grill with multiple burners and side shelves",
                    20,
                    "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    new BigDecimal("349.99"),
                    4L  // Home & Garden category
            );

            ProductRequestDTO p5 = new ProductRequestDTO(
                    "Basketball",
                    "Official size basketball for indoor/outdoor play",
                    60,
                    "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    new BigDecimal("29.95"),
                    5L  // Sports category
            );

            ProductRequestDTO p6 = new ProductRequestDTO(
                    "Digital Camera",
                    "Mirrorless camera with 4K video recording",
                    35,
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    new BigDecimal("799.99"),
                    1L  // Electronics category
            );

            ProductRequestDTO p7 = new ProductRequestDTO(
                    "Denim Jeans",
                    "Classic fit denim jeans for everyday wear",
                    85,
                    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    new BigDecimal("59.99"),
                    2L  // Clothing category
            );

            ProductRequestDTO p8 = new ProductRequestDTO(
                    "Self-Help Book",
                    "Guide to personal development and success",
                    90,
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
                    new BigDecimal("18.99"),
                    3L  // Books category
            );

            ProductRequestDTO p9 = new ProductRequestDTO(
                    "Pressure Cooker",
                    "Multi-functional electric pressure cooker",
                    45,
                    "https://static.independent.co.uk/2022/09/07/15/Pressure%20king%20pro.png",
                    new BigDecimal("129.99"),
                    4L 
            );

            ProductRequestDTO p10 = new ProductRequestDTO(
                    "Tennis Racket",
                    "Professional tennis racket with grip tape",
                    30,
                    "https://images.pexels.com/photos/5741299/pexels-photo-5741299.jpeg",
                    new BigDecimal("149.95"),
                    5L  // Sports category
            );

            ProductRequestDTO p11 = new ProductRequestDTO(
                    "Tablet Computer",
                    "10-inch tablet with stylus and high resolution display",
                    25,
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJvps-UlWdkarq4dH1Nwng7RDWIJnZbwH87ssoCiqx5e_yslsb",
                    new BigDecimal("449.99"),
                    1L  // Electronics category
            );

            ProductRequestDTO p12 = new ProductRequestDTO(
                    "Winter Gloves",
                    "Insulated waterproof gloves for cold weather",
                    100,
                    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    new BigDecimal("24.99"),
                    2L  // Clothing category
            );

            ProductRequestDTO p13 = new ProductRequestDTO(
                    "Science Fiction Novel",
                    "Best-selling sci-fi adventure novel",
                    70,
                    "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    new BigDecimal("16.99"),
                    3L  // Books category
            );

            ProductRequestDTO p14 = new ProductRequestDTO(
                    "Lawn Mower",
                    "Self-propelled gas lawn mower with bag",
                    15,
                    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQlGS4GmGYtnT4AfpT5TEljwAg7DbT9adWQgEO5uKI0NIKbg4q4u2Dva_92Tm0hsoxMzKOJZB0gXd0OR7KEQOqr0suiYscgV9MN1zRRnPtm&usqp=CAc",
                    new BigDecimal("399.99"),
                    4L  // Home & Garden category
            );

            ProductRequestDTO p15 = new ProductRequestDTO(
                    "Soccer Ball",
                    "Official FIFA-approved soccer ball",
                    80,
                    "https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg",
                    new BigDecimal("27.99"),
                    5L  // Sports category
            );

            ProductRequestDTO p16 = new ProductRequestDTO(
                    "Smart Watch",
                    "Fitness tracker with heart rate monitor and GPS",
                    45,
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1199&q=80",
                    new BigDecimal("199.99"),
                    1L  // Electronics category
            );

            ProductRequestDTO p17 = new ProductRequestDTO(
                    "Summer Dress",
                    "Lightweight floral summer dress",
                    65,
                    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    new BigDecimal("42.99"),
                    2L  // Clothing category
            );

            ProductRequestDTO p18 = new ProductRequestDTO(
                    "Biography Book",
                    "Inspirational biography of a famous leader",
                    55,
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
                    new BigDecimal("21.99"),
                    3L  // Books category
            );

            ProductRequestDTO p19 = new ProductRequestDTO(
                    "Garden Hose",
                    "Expandable garden hose with spray nozzle",
                    120,
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHNdlCrTkSB6Ea9kYQHgLhRL3W4s6zSZvgTnZY_cbWjEhjclG0ohQu&usqp=CAE&s",
                    new BigDecimal("29.99"),
                    4L  // Home & Garden category
            );

            ProductRequestDTO p20 = new ProductRequestDTO(
                    "Yoga Block",
                    "Eco-friendly cork yoga block for support",
                    95,
                    "https://cdn11.bigcommerce.com/s-qh8opzgoqs/images/stencil/1280x1280/products/7550/11358/media__29175.1729187131.jpg?c=1",
                    new BigDecimal("14.99"),
                    5L  // Sports category
            );

            // Create all 20 new products
            productService.create(p1);
            productService.create(p2);
            productService.create(p3);
            productService.create(p4);
            productService.create(p5);
            productService.create(p6);
            productService.create(p7);
            productService.create(p8);
            productService.create(p9);
            productService.create(p10);
            productService.create(p11);
            productService.create(p12);
            productService.create(p13);
            productService.create(p14);
            productService.create(p15);
            productService.create(p16);
            productService.create(p17);
            productService.create(p18);
            productService.create(p19);
            productService.create(p20);


            ProductRequestDTO p21 = new ProductRequestDTO(
                    "MacBook Pro M3",
                    "Super fast laptop with M3 chip",
                    10,
                    "https://avatars.mds.yandex.net/get-mpic/17392064/2a00000198d2329fc0a4713b9d03063c3071/optimize",
                    new BigDecimal("2500.00"),
                    electronicsCat.getId()
            );

            ProductRequestDTO p22 = new ProductRequestDTO(
                    "Wireless Mouse",
                    "Ergonomic wireless mouse with long battery life",
                    50,
                    "https://i0.wp.com/chinthanagsm.lk/wp-content/uploads/2024/12/Ugreen-4000dpi-wireless-mouse.jpg?fit=1000%2C1000&ssl=1",
                    new BigDecimal("25.50"),
                    electronicsCat.getId()
            );

            ProductRequestDTO p23 = new ProductRequestDTO(
                    "Smartphone",
                    "Latest model smartphone with advanced features",
                    25,
                    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1255&q=80",
                    new BigDecimal("899.99"),
                    electronicsCat.getId()
            );

            ProductRequestDTO p24 = new ProductRequestDTO(
                    "Designer T-Shirt",
                    "Comfortable cotton t-shirt with unique design",
                    100,
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                    new BigDecimal("29.99"),
                    clothingCat.getId()
            );

            ProductRequestDTO p25 = new ProductRequestDTO(
                    "Winter Jacket",
                    "Warm jacket for cold weather",
                    40,
                    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
                    new BigDecimal("129.95"),
                    clothingCat.getId()
            );

            ProductRequestDTO p26 = new ProductRequestDTO(
                    "Bestselling Novel",
                    "Award-winning fiction novel",
                    75,
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
                    new BigDecimal("19.99"),
                    booksCat.getId()
            );

            ProductRequestDTO p27 = new ProductRequestDTO(
                    "Indoor Plant",
                    "Low maintenance plant for your home",
                    60,
                    "https://tgfiles.oxapp.io/cache/original/image/67/c2/a4/67c2a49fbd41476f4662eab27c66753e888451f1fd12816166659158e74808b6.png",
                    new BigDecimal("34.99"),
                    homeGardenCat.getId()
            );

            ProductRequestDTO p28 = new ProductRequestDTO(
                    "Fitness Tracker",
                    "Track your workouts and health metrics",
                    85,
                    "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1115&q=80",
                    new BigDecimal("79.95"),
                    sportsCat.getId()
            );

            productService.create(p21);
            productService.create(p22);
            productService.create(p23);
            productService.create(p24);
            productService.create(p25);
            productService.create(p26);
            productService.create(p27);
            productService.create(p28);

        }
    }
}