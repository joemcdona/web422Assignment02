/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Joseph McDonald Student ID: 060257144 Date: 02/03/23
*
********************************************************************************/ 

page = 1;
const perPage = 10;

function loadMovieData(title = null)
{
    let url = title
    ? "https://dark-tan-flannel-nightgown.cyclic.app/api/movies?page="+page+"&perPage="+perPage+"&title="+title+""
    : "https://dark-tan-flannel-nightgown.cyclic.app/api/movies?page="+page+"&perPage="+perPage+"";
    currentButton = document.querySelector("#current-page");
    currentButton.innerHTML = page;
    
        pagination = document.querySelector(".pagination");
        if(title != null && title != undefined)
        {
            page = 1;
            pagination.classList.add("d-none")
        }
        else
        {
            pagination.classList.remove("d-none");
        }
        fetch(url) 
            .then((res) => res.json())
            .then((data) => { 
                let movieData = `
                ${data.map(mov => (
                `<tr data-id=${mov._id} data-bs-toggle="modal" data-bs-target="#detailsModal">
                    <td>${mov.year}</td>
                    <td>${mov.title}</td>
                    <td>${mov.plot || "N/A"}</td>
                    <td>${mov.rated || "N/A"}</td>
                    <td>${Math.floor(mov.runtime / 60)}:${(mov.runtime % 60).toString().padStart(2, '0')}</td>
                </tr>`
                )).join('')}`;
                document.querySelector("#tableBody").innerHTML = "";
                document.querySelector("#tableBody").innerHTML = movieData;      
            console.log(data);
        }).then(()=> {
            document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
                row.addEventListener('click', (e) => {
                  console.log('clicked');
                  let dataID = row.getAttribute("data-id");
                    console.log(dataID);
                    fetch("https://dark-tan-flannel-nightgown.cyclic.app/api/movies/"+dataID+"")
                    .then((res) => res.json())
                    .then((data) => { 
                        document.querySelector(".modal-title").innerHTML = data.title;
                        let dataBody =
                            `
                            <img class="img-fluid w-100" src=${data.poster}><br><br>
                            <strong>Directed By:</strong> ${data.directors.join(', ')}<br><br>
                            <p>${data.fullplot}</p>
                            <strong>Cast:</strong> ${data.cast.join(", ") || "N/A"} <br><br>
                            <strong>Awards:</strong> ${data.awards.text}<br>
                            <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes})
                            `;
                        document.querySelector(`.modal-body`).innerHTML = dataBody;
                        row.setAttribute("data-bs-toggle", "modal");
                        row.setAttribute("data-bs-target", "#detailsModal");
                        console.log(data);
                    }).catch((err)=>{
                        console.log(err);
                    });
                });
            });
        }).catch((err)=>{
            console.log(err);
        });
        currentButton.innerHTML = page;   
}


document.addEventListener('DOMContentLoaded', function () {

    currentButton = document.querySelector("#current-page");
    currentButton.innerHTML = page;

    previousButton = document.getElementById('previous-page');
    previousButton.addEventListener('click', function () {
        if(page > 1)
        {
            page--;
            loadMovieData();
        }
    });
    nextButton = document.getElementById('next-page');
    nextButton.addEventListener('click', function () {
        page++;
        loadMovieData();
    });

    searchButton = document.getElementById("searchForm");
    searchButton.addEventListener('submit', (event) => {
        event.preventDefault();
        let titleValue = document.getElementById('title');
        let titleData = titleValue.value;
        loadMovieData(titleData);
        console.log(titleData);       
    });

    clearButton = document.getElementById("clearForm");
    clearButton.addEventListener('click', (event) => {
        loadMovieData();
    });   
});