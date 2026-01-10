//Page loading
function loadPage(pageId) {
    const template = document.getElementById(pageId);
    const content = template.content.cloneNode(true);

    const root = document.getElementById("root"); 
    root.innerHTML = ""; 
    root.appendChild(content);

    if (pageId === 'signin') initSigninForm()
    if (pageId === 'signup') initSignupForm()
    if (pageId === 'admin-panel') initAdminPanel()
    if (pageId === 'shop') initShop()
    
    const adminBlock = document.getElementById("admin-block");
    const userBlock = document.getElementById("user-block");

    if (adminBlock) {
        adminBlock.addEventListener("click", () => {
            loadPage("admin-panel");
        });
    }

    if (userBlock) {
        userBlock.addEventListener("click", () => {
            loadPage("shop");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPage("shop");
});

//API
const API_URL = 'https://69616d72e7aa517cb798dc0c.mockapi.io/api/users'

//Sign Up
function initSignupForm() {
    const form = document.getElementById('signup-form')
    if (!form) return

    form.addEventListener('submit', async (event) => {
        event.preventDefault() 

        const name = form.querySelector('#name').value
        const email = form.querySelector('#email').value
        const password = form.querySelector('#password').value

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })

            if (!res.ok) throw new Error('Trouble has been occcured')

            const newUser = await res.json()
            alert(`User ${newUser.name} has been registrated!`)
        } 
        catch (err) {
            alert(err.message)
        }
    })
}

//Sign In
let CurrentUserName = '' 
function initSigninForm() {
    const form = document.getElementById('signin-form')
    if (!form) return

    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        const email = form.querySelector('#email').value
        const password = form.querySelector('#password').value

        try {
            const res = await fetch(API_URL)
            const users = await res.json()

            const user = users.find(u => u.email === email && u.password === password)
            CurrentUserName = user.name
            if (user) {
                loadPage('menu');
                alert(`Welcome, ${user.name}!`)
            } else {alert('Wrong email or password')}
        } catch (err) {
            alert(err.message)
        }
    })
}

//Admin Panel

async function initAdminPanel() {
    const usersTable = document.getElementById('usersTable');
    const editPanel = document.getElementById('editPanel');
    const editId = document.getElementById('editId');
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const editPassword = document.getElementById('editPassword');
    const saveBtn = document.getElementById('saveBtn');
    const closeBtn = document.getElementById('closeBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    if (!saveBtn.hasAttribute('data-listener')) {
        closeBtn.addEventListener('click', () => editPanel.classList.add('hidden'));

        saveBtn.addEventListener('click', async () => {
            const id = editId.value;
            const updatedUser = { name: editName.value, email: editEmail.value, password: editPassword.value };
            try {
                await fetch(`${API_URL}/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(updatedUser) });
                await initAdminPanel(); 
                editPanel.classList.add('hidden');
            } catch (err) { alert(err.message); }
        });

        deleteBtn.addEventListener('click', async () => {
            const id = editId.value;
            if (!confirm('Are you sure you want to delete this user?')) return;
            try {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                await initAdminPanel();
                editPanel.classList.add('hidden');
            } catch (err) { alert(err.message); }
        });

        saveBtn.setAttribute('data-listener', 'true');
    }

    try {
        const users = await fetch(API_URL).then(res => res.json());
        usersTable.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${user.id}</td><td>${user.name}</td><td>${user.email}</td><td>${user.password}</td>`;
            row.addEventListener('click', () => {
                editId.value = user.id;
                editName.value = user.name;
                editEmail.value = user.email;
                editPassword.value = user.password;
                editPanel.classList.remove('hidden');
            });
            usersTable.appendChild(row);
        });
    } catch (err) {
        alert(err.message);
    }
}

//Shop
const productAPI = 'https://dummyjson.com/products' 
async function initShop() {
    let welcomeUser = document.getElementById('welcomeUser')
    if(CurrentUserName === '') welcomeUser.innerHTML = `Welcome!`
    else welcomeUser.innerHTML = `Welcome, ${CurrentUserName}!`

    let productContainer = document.getElementById('productContainer')
    
    try {
        const res = await fetch(productAPI);
        const data = await res.json();

        productContainer.innerHTML = '';

        data.products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description}</p>

                <div class="product-footer">
                    <span class="product-price">$${product.price}</span>
                    <button class="buy-btn">Buy</button>
                </div>
            `;

            productContainer.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        productContainer.innerHTML = '<p class="text-red-500">Failed to load products</p>';
    }
}