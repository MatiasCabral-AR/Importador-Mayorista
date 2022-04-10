// Open Cart (modal)

const modal = document.getElementById("modal");
const openModal = document.getElementById("open-button");
const closeModal = document.getElementById("close-button");

openModal.addEventListener('click', () =>{
    modal.showModal();
})

closeModal.addEventListener('click', () => {
    modal.close();
})

// Cart load

