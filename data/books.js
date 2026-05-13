const books = [
    {
        title: "Atomic Habits",
        author: "James Clear",
        category: ["Self Help"],
        image: "https://m.media-amazon.com/images/I/81wgcld4wxL._SL1500_.jpg",
        description: "A practical guide to building good habits, breaking bad ones, and mastering the small behaviors that lead to remarkable results over time."
    },
    {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        category: ["Fantasy"],
        image: "https://m.media-amazon.com/images/I/81YOuOGFCJL._SL1500_.jpg",
        description: "A young boy discovers he is a wizard and begins his magical journey at Hogwarts School of Witchcraft and Wizardry."
    },
    {
        title: "Harry Potter and the Prisoner of Azkaban",
        author: "J.K. Rowling",
        category: ["Fantasy"],
        image: "https://ia600505.us.archive.org/view_archive.php?archive=/35/items/l_covers_0014/l_covers_0014_65.zip&file=0014656700-L.jpg",
        description: "Harry returns to Hogwarts while a dangerous prisoner escapes from Azkaban, revealing shocking secrets from the past."
    },
    {
        title: "Harry Potter and the Goblet of Fire",
        author: "J.K. Rowling",
        category: ["Fantasy"],
        image: "https://m.media-amazon.com/images/I/81t2CVWEsUL._SL1500_.jpg",
        description: "Harry is unexpectedly entered into the Tri wizard Tournament, facing deadly challenges and the return of a dark force."
    },
    {
        title: "Harry Potter and the Deathly Hallows",
        author: "J.K. Rowling",
        category: ["Fantasy"],
        image: "https://covers.openlibrary.org/b/id/7904782-L.jpg",
        description: "Harry, Ron, and Hermione set out on a dangerous mission to destroy Voldemort’s Horcruxes and end the wizarding war."
    },
    {
        title: "Harry Potter and the Half-Blood Prince",
        author: "J.K. Rowling",
        category: ["Fantasy"],
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1627043894i/58613345.jpg",
        description: "As Voldemort’s power grows, Harry uncovers secrets about the Dark Lord’s past through a mysterious potions book."
    },
    {
        title: "Dune",
        author: "Frank Herbert",
        category: ["Science Fiction"],
        image: "https://covers.openlibrary.org/b/id/15092781-L.jpg",
        description: "Paul Atreides is thrust into a struggle for control of the desert planet Arrakis, the source of the universe’s most valuable substance."
    },
    {
        title: "Dune Messiah",
        author: "Frank Herbert",
        category: ["Science Fiction"],
        image: "https://covers.openlibrary.org/b/id/15209757-L.jpg",
        description: "Paul Atreides faces political conspiracies and the heavy consequences of becoming emperor and religious leader."
    },
    {
        title: "Children of Dune",
        author: "Frank Herbert",
        category: ["Science Fiction"],
        image: "https://ia802908.us.archive.org/view_archive.php?archive=/24/items/olcovers28/olcovers28-L.zip&file=284479-L.jpg",
        description: "The children of Paul Atreides struggle with destiny, power, and survival as the future of Arrakis hangs in the balance."
    },
    {
        title: "God Emperor of Dune",
        author: "Frank Herbert",
        category: ["Science Fiction"],
        image: "https://ia600505.us.archive.org/view_archive.php?archive=/35/items/l_covers_0014/l_covers_0014_61.zip&file=0014612739-L.jpg",
        description: "Thousands of years after transforming himself, Leto II rules the galaxy with absolute power to secure humanity’s future."
    },
    {
        title: "Think and Grow Rich",
        author: "Napoleon Hill",
        category: ["Business"],
        image: "https://m.media-amazon.com/images/I/71UypkUjStL._SL1500_.jpg",
        description: "A motivational classic that explores the mindset, discipline, and habits needed to achieve success and financial wealth."
    },
    {
        title: "Lord of the Rings: The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        category: ["Fantasy"],
        image: "https://www.booksbykilo.in/media/books/BBK/9780261102354.jpg",
        description: "Frodo Baggins begins a perilous journey with a fellowship to destroy the One Ring before evil consumes Middle-earth."
    },
    {
        title: "Lord of the Rings: The Two Towers",
        author: "J.R.R. Tolkien",
        category: ["Fantasy"],
        image: "https://cdn.shopify.com/s/files/1/0625/6679/3413/files/The_20Two_20Towers_20_the_20Lord_20of_20the_20Rings_20Book_202.jpg?v=1716573397&width=400&crop=center",
        description: "The fellowship is broken as heroes battle powerful enemies while Frodo and Sam continue toward Mordor."
    },
    {
        title: "Lord of the Rings: The Return of the King",
        author: "J.R.R. Tolkien",
        category: ["Fantasy"],
        image: "https://cdn.shopify.com/s/files/1/0625/6679/3413/files/978-0-261-10237-8.jpg?v=1754439383&width=400&crop=center",
        description: "The final battle for Middle-earth begins as Aragorn rises to his destiny and Frodo nears Mount Doom."
    },
    {
        title: "Goosebumps: Welcome to Dead House",
        author: "R.L. Stine",
        category: ["Horror", "Thriller"],
        image: "https://covers.openlibrary.org/b/id/14855397-L.jpg",
        description: "A family moves into a creepy town where strange events reveal terrifying secrets hidden inside their new home."
    },
    {
        title: "$100M Offers: How to Make Offers So Good People Feel Stupid Saying No",
        author: "Alex Hormozi",
        category: ["Business"],
        image: "https://ia801909.us.archive.org/view_archive.php?archive=/31/items/l_covers_0013/l_covers_0013_17.zip&file=0013173640-L.jpg",
        description: "A business guide that teaches how to create irresistible offers that attract customers and dramatically increase sales."
    },
    {
        title: "The Fault in Our Stars",
        author: "John Green",
        category: ["Romance"],
        image: "https://m.media-amazon.com/images/I/817tHNcyAgL._SL1500_.jpg",
        description: "Two teenagers with cancer fall in love while navigating life, loss, and the meaning of existence."
    },
    {
        title: "The 48 Laws of Power",
        author: "Robert Greene",
        category: ["Self Help"],
        image: "https://covers.openlibrary.org/b/id/15177890-L.jpg",
        description: "A bestselling guide to understanding power, influence, strategy, and human behavior through historical lessons."
    },
    {
        title: "The 33 Strategies of War",
        author: "Robert Greene",
        category: ["Self Help"],
        image: "https://covers.openlibrary.org/b/isbn/9780670034574-L.jpg",
        description: "Robert Greene explores military principles and strategic thinking that can be applied to business and everyday life."
    },
    {
        title: "The Art of Seduction",
        author: "Robert Greene",
        category: ["Self Help"],
        image: "https://covers.openlibrary.org/b/isbn/9780142001196-L.jpg",
        description: "An examination of persuasion, attraction, and psychological influence using examples from history and culture."
    },
    {
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        category: ["Business", "Self Help"],
        image: "https://m.media-amazon.com/images/I/81bsw6fnUiL._SL1500_.jpg",
        description: "A personal finance classic that contrasts two different views on money, investing, and building wealth."
    },
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        category: ["Fantasy"],
        image: "https://www.newportbeachca.gov/home/showpublishedimage/52130/637273800534970000",
        description: "Bilbo Baggins joins a group of dwarves on an unexpected adventure to reclaim treasure guarded by a dragon."
    },
    {
        title: "Steve Jobs",
        author: "Walter Isaacson",
        category: ["Biography"],
        image: "https://ia600100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_68.zip&file=0012680694-L.jpg",
        description: "A detailed biography of Steve Jobs, exploring his life, leadership, and role in shaping modern technology."
    }
];

export default books;