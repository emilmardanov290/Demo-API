//Page loading
const MainContainer = document.getElementById('MainContainer')

function loadPage(page) {
    const template = document.getElementById(page)
    if (!template) {
        MainContainer.innerHTML = 'Page not found'
        return
    }

    MainContainer.innerHTML = ''
    MainContainer.append(template.content.cloneNode(true))

    if (page === 'signin') initSigninForm()
    if (page === 'signup') initSignupForm()
}

document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-page]')
    if (!link) return

    e.preventDefault()
    loadPage(link.dataset.page)
})

loadPage('signin')

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
            if (user) alert(`Welcome, ${user.name}!`)
            else alert('Wrong email or password')
        } catch (err) {
            alert(err.message)
        }
    })
}



