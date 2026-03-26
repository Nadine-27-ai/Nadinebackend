const form = document.getElementById("catForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const catName = document.getElementById("catName").value;

    try {
        await fetch("http://localhost:3000/api/submit-cat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ catName })
        });

        alert("Cat saved!");
        form.reset();
    } catch (error) {
        console.error(error);
        alert("Error saving cat");
    }
});

async function loadCats() {
    try {
        const res = await fetch("http://localhost:3000/api/cats");
        const cats = await res.json();

        const list = document.getElementById("catList");
        list.innerHTML = "";

        cats.forEach(cat => {
            const li = document.createElement("li");
            li.textContent = cat.name;
            list.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        alert("Error loading cats");
    }
}