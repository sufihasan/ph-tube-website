
const showLoader = () => {
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('video-container').classList.add('hidden');
}

const hideLoader = () => {
    document.getElementById('video-container').classList.remove('hidden');
    document.getElementById('loader').classList.add('hidden');
}

function removeActiveClass() {
    const activeButtons = document.getElementsByClassName('active');
    // console.log(activeButtons);
    for (let btn of activeButtons) {
        btn.classList.remove('active');
    }
}

function loadCategories() {

    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json()) // convert promise to json
        .then(data => displayCategories(data.categories))
}

function loadVideos(searchText = '') {
    showLoader();
    console.log(searchText);

    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => {
            removeActiveClass();
            document.getElementById('btn-all').classList.add('active');
            displayVideos(data.videos)
        })
}

const loadCategoriesVideos = (id) => {
    showLoader();
    // console.log(id);
    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActiveClass();
            const clickedButton = document.getElementById(`btn-${id}`);
            clickedButton.classList.add('active');
            console.log(clickedButton);
            displayVideos(data.category)
        })
}

const loadVideoDetails = (videoId) => {
    // console.log(videoId);
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => displayVideoDetails(data.video))
}




const displayVideoDetails = (videoDetails) => {
    console.log(videoDetails);
    document.getElementById('video_details').showModal();
    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = `
   <div class="card bg-base-100 image-full shadow-sm">
  <figure>
    <img
      src="${videoDetails.thumbnail}"
      alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div class="card-actions justify-end">
      
    </div>
  </div>
</div>
    `;
}



function displayCategories(categories) {
    //get the container
    const categoryContainer = document.getElementById('category-container');

    //loop operation on array of object
    for (let cat of categories) {
        // console.log(cat);
        //create element
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `
        <button id='btn-${cat.category_id}' onclick="loadCategoriesVideos(${cat.category_id})" class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${cat.category}</button>
        `;

        //append child
        categoryContainer.appendChild(categoryDiv);


    }

}

const displayVideos = (videos) => {
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = '';
    if (videos.length === 0) {

        videoContainer.innerHTML = `
         <div class="col-span-full flex justify-center items-center  py-20">
            <div>
                <img class="mx-auto mb-2" src="assets/Icon.png" alt="">
                <h2 class="text-2xl font-bold">Oops!! Sorry, There is no content here</h2>
            </div>
            
        </div>
        `;
        hideLoader();
        return;
    }
    videos.forEach(video => {
        // console.log(video);
        const videoCard = document.createElement('div');
        videoCard.innerHTML = `
       
<div class="card bg-base-100 ">
            <figure class="relative ">
                <img class="w-full h-[150px] object-cover" src="${video.thumbnail}" alt="Shoes" />
                <span class="absolute bottom-2 right-2 text-white bg-black/20 rounded
                 text-sm px-2">3hrs 56 min
                    ago</span>
            </figure>
            <div class=" flex gap-3 px-0 py-5">
                <div class="profile">
                    <div class="avatar">
                        <div class="ring-primary ring-offset-base-100 w-6  rounded-full ring ring-offset-2">
                            <img src="${video.authors[0].profile_picture}" />
                        </div>
                    </div>
                </div>
                <div class="intro">
                    <h2 class="text-sm font-semibold">Midnight Serenade</h2>
                    <p class="text-gray-400 text-sm flex gap-1">
                    ${video.authors[0].profile_name}
                    ${video.authors[0].verified === true ? `
                        <img class="w-5 h-5" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" alt="">`
                : ``}
                        
                    </p>
                    <p class="text-gray-400 text-sm">${video.others.views} views</p>
                </div>
            </div>
            <button onclick="loadVideoDetails('${video.video_id}')" class="btn btn-block">Show Details</button>
        </div>

        `;
        videoContainer.appendChild(videoCard);
    });
    hideLoader();
}

document.getElementById('serch-input').addEventListener('keyup', (e) => {
    const input = e.target.value;
    // console.log(input);
    loadVideos(input);
})


loadCategories();
loadVideos();
