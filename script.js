
const API_URL = "https://fakestoreapi.com/users";

const usersContainer = document.getElementById("users");
const statusText = document.getElementById("status");
const searchInput = document.getElementById("search");
const reloadButton = document.getElementById("reload");

let allUsers = [];

async function loadUsers() {
    statusText.textContent = "⏳ API-სთან დაკავშირება...";
    reloadButton.disabled = true;
    usersContainer.replaceChildren();

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("HTTP შეცდომა: " + response.status);
        }

        const users = await response.json();

        if (!Array.isArray(users)) {
            throw new Error("API-მ არასწორი მონაცემები დააბრუნა.");
        }

        allUsers = users;

        statusText.textContent =
            "✅ API დაკავშირებულია! მომხმარებლები: " +
            allUsers.length;

        renderUsers(allUsers);

} 
}


function renderUsers(users) {
    usersContainer.replaceChildren();

    if (users.length === 0) {
        const message = document.createElement("p");
        message.className = "empty";
        message.textContent = "მომხმარებლები ვერ მოიძებნა.";
        usersContainer.appendChild(message);
        return;
    }

    users.forEach(user => {
        const card = document.createElement("article");
        card.className = "user-card";

        const name = document.createElement("h2");
        name.textContent =
            `${user.name?.firstname || ""} ${user.name?.lastname || ""}`.trim()
            || "უცნობი მომხმარებელი";

        const username = document.createElement("p");
        username.className = "username";
        username.textContent = "@" + (user.username || "unknown");

        const info = document.createElement("div");
        info.className = "info";

        const email = document.createElement("p");
        email.textContent = "📧 " + (user.email || "არ არის მითითებული");

        const phone = document.createElement("p");
        phone.textContent = "📱 " + (user.phone || "არ არის მითითებული");

        const city = document.createElement("p");
        city.textContent =
            "📍 " + (user.address?.city || "უცნობია");

        const id = document.createElement("p");
        id.textContent = "🆔 ID: " + user.id;

        info.append(email, phone, city, id);
        card.append(name, username, info);

        usersContainer.appendChild(card);
    });
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    const filtered = allUsers.filter(user => {
        const fullName =
            `${user.name?.firstname || ""} ${user.name?.lastname || ""}`;

        return (
            fullName.toLowerCase().includes(query) ||
            (user.username || "").toLowerCase().includes(query) ||
            (user.email || "").toLowerCase().includes(query)
        );
    });

    renderUsers(filtered);

    statusText.textContent =
        `ნაჩვენებია ${filtered.length} მომხმარებელი`;
});


reloadButton.addEventListener("click", loadUsers);


loadUsers();
