export const sampleMenu = {
  restaurantName: "Sample Restaurant",
  sections: [
    {
      id: "1",
      section: "Appetizers",
      groups: [], // 👈 No groups in this section
      items: [
        {
          id: "ap1",
          name: "Spring Rolls",
          description: "Crispy rolls stuffed with vegetables.",
          price: 5.99,
          image: "https://source.unsplash.com/400x300/?spring-rolls",
          available: true,
          visible: true,
          modifiers: [
            { id: "m1", name: "Extra Sauce", price: 0.5 },
            { id: "m2", name: "Spicy", price: 0 },
          ],
        },
        {
          id: "ap2",
          name: "Garlic Bread",
          description: "Toasted bread with garlic and herbs.",
          price: 4.49,
          image: "https://source.unsplash.com/400x300/?garlic-bread",
          available: false,
          visible: true,
          modifiers: [],
        },
        {
          id: "ap3",
          name: "Bruschetta",
          description: "Grilled bread with tomato and basil.",
          price: 6.25,
          image: "https://source.unsplash.com/400x300/?bruschetta",
          available: true,
          visible: false,
          modifiers: [],
        },
      ],
    },
    {
      id: "2",
      section: "Mains",
      groups: [], // 👈 optional empty if not grouping yet
      items: [
        {
          id: "mn1",
          name: "Grilled Chicken",
          description: "Juicy grilled chicken with herbs.",
          price: 12.99,
          image: "https://source.unsplash.com/400x300/?grilled-chicken",
          available: true,
          visible: true,
          modifiers: [
            { id: "m3", name: "Add Rice", price: 2 },
            { id: "m4", name: "Extra Veggies", price: 1.5 },
          ],
        },
        {
          id: "mn2",
          name: "Veggie Pasta",
          description: "Pasta tossed with fresh vegetables.",
          price: 10.49,
          image: "https://source.unsplash.com/400x300/?pasta",
          available: true,
          visible: true,
          modifiers: [
            { id: "m5", name: "Gluten-Free Pasta", price: 1 },
          ],
        },
        {
          id: "mn3",
          name: "Cheeseburger",
          description: "Beef patty with melted cheese and fries.",
          price: 11.99,
          image: "https://source.unsplash.com/400x300/?burger",
          available: true,
          visible: true,
          modifiers: [
            { id: "m6", name: "Add Bacon", price: 2 },
            { id: "m7", name: "Extra Cheese", price: 1 },
            { id: "m8", name: "No Onions", price: 0 },
          ],
        },
      ],
    },
    {
      id: "3",
      section: "Desserts",
      groups: [], // 👈 still allowed
      items: [
        {
          id: "ds1",
          name: "Chocolate Cake",
          description: "Rich and moist chocolate cake.",
          price: 6.99,
          image: "https://source.unsplash.com/400x300/?chocolate-cake",
          available: true,
          visible: true,
          modifiers: [],
        },
        {
          id: "ds2",
          name: "Cheesecake",
          description: "Creamy cheesecake with berry topping.",
          price: 7.49,
          image: "https://source.unsplash.com/400x300/?cheesecake",
          available: true,
          visible: true,
          modifiers: [
            { id: "m9", name: "Strawberry Topping", price: 1 },
            { id: "m10", name: "Chocolate Syrup", price: 1 },
          ],
        },
        {
          id: "ds3",
          name: "Ice Cream",
          description: "Two scoops of vanilla or chocolate.",
          price: 4.99,
          image: "https://source.unsplash.com/400x300/?ice-cream",
          available: true,
          visible: true,
          modifiers: [
            { id: "m11", name: "Add Sprinkles", price: 0.5 },
            { id: "m12", name: "Whipped Cream", price: 0.75 },
          ],
        },
      ],
    },
    {
      id: "4",
      section: "Drinks",
      groups: [
        {
          id: "g1",
          groupName: "Atole", // 👈 group within Drinks
          items: [
            {
              id: "drA1",
              name: "Atole de Elote",
              description: "Sweet corn-based traditional atole.",
              price: 3.99,
              image: "https://source.unsplash.com/400x300/?corn-drink",
              available: true,
              visible: true,
              modifiers: [],
            },
            {
              id: "drA2",
              name: "Champurrado",
              description: "Thick Mexican chocolate atole.",
              price: 4.49,
              image: "https://source.unsplash.com/400x300/?champurrado",
              available: true,
              visible: true,
              modifiers: [],
            },
          ],
        },
        {
          id: "g2",
          groupName: "Aguas Frescas", // 👈 another optional group
          items: [
            {
              id: "drF1",
              name: "Horchata",
              description: "Rice and cinnamon drink.",
              price: 2.99,
              image: "https://source.unsplash.com/400x300/?horchata",
              available: true,
              visible: true,
              modifiers: [],
            },
            {
              id: "drF2",
              name: "Jamaica",
              description: "Hibiscus flower tea served cold.",
              price: 2.99,
              image: "https://source.unsplash.com/400x300/?jamaica-drink",
              available: true,
              visible: true,
              modifiers: [],
            },
          ],
        },
      ],
      items: [
        {
          id: "dr3",
          name: "Coffee",
          description: "Hot brewed coffee.",
          price: 2.99,
          image: "https://source.unsplash.com/400x300/?coffee",
          available: true,
          visible: true,
          modifiers: [
            { id: "m13", name: "Add Milk", price: 0.5 },
            { id: "m14", name: "Extra Shot", price: 1 },
          ],
        },
      ],
    },
  ],
};
