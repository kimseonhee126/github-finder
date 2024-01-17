const head = document.getElementById('search');
const middleArea = document.getElementById('middle');
const latestRepoArea = document.getElementById('latest-repo');
const grassBtn = document.getElementById('grassBtn');
let repos = []

function searchUser() {
    let username = document.getElementById("searchText").value;

    let profileUrl = `https://api.github.com/users/${username}`;
    let repoUrl = `https://api.github.com/users/${username}/repos`;

    fetch(profileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const middleItem = {
                img: data.avatar_url,
                publicRepo: data.public_repos,
                publicGists: data.public_gists,
                followers: data.followers,
                following: data.following,
                company: data.company,
                blogUrl: data.blog,
                location: data.location,
                memberSince: data.created_at,
            };

            searchRepo(repoUrl)
                .then(repoItem => { 
                    // createMiddle 함수 호출
                    const middleEl = createMiddle(middleItem, repoItem, username);
                })
                .catch(error => {
                    console.error("Error fetching repo data:", error);
                });

            console.log(middleItem);          
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function searchRepo(repoUrl) {
    return new Promise((resolve, reject) => {
        let newRepo = [];

        fetch(repoUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                let cnt = 0;
                while (cnt < 7) {
                    newRepo.push({
                        title: data[cnt].name,
                        stars: data[cnt].stargazers_count,
                        watchers: data[cnt].watchers_count,
                        forks: data[cnt].forks_count,
                    });
                    cnt = cnt + 1;
                }
                resolve(newRepo);
            })
            .catch(error => {
                console.error("Error 발생:", error);
                reject(error);
            });
    });
}

function createMiddle(middleItem, repoItem, username) {
    const middleEl = document.createElement("div");
    middleEl.classList.add('profile')

    const imgEl = document.createElement('img');
    imgEl.src = middleItem.img;
    imgEl.alt = 'Image';

    const viewBtn = document.createElement('button');
    viewBtn.classList.add('view-profile');
    viewBtn.innerText = 'View Profile'

    // view profile 이벤트 리스너 등록
    viewBtn.addEventListener('click', () => {
        const viewProfileURL = `https://github.com/${username}`;

        window.location.href = viewProfileURL;
    })

    /* info-container1 설정 */
    // public repo, public gist, followers, following 구하기
    const infoEl1 = document.createElement('div');
    infoEl1.classList.add('info-container1');

    const publicRepoEl = document.createElement('p');
    publicRepoEl.classList.add('public-repos');
    publicRepoEl.innerText = `Public Repos: ${middleItem.publicRepo}`;

    const publicGistEl = document.createElement('p');
    publicGistEl.classList.add('public-gist');
    publicGistEl.innerText = `Public Gists: ${middleItem.publicGists}`;

    const followersEl = document.createElement('p');
    followersEl.classList.add('followers');
    followersEl.innerText = `Followers: ${middleItem.followers}`;

    const followingEl = document.createElement('p');
    followingEl.classList.add('following');
    followingEl.innerText = `Following: ${middleItem.following}`;
    
    /* info-container2 설정 */
    // company, website/blog, location, member since 구하기
    const infoEl2 = document.createElement('div');
    infoEl2.classList.add('info-container2');

    const company = document.createElement('p');
    company.classList.add('company');
    company.innerText = `Company: ${middleItem.company}`;

    const blog = document.createElement('p');
    blog.classList.add('blog');
    blog.innerText = `Website / Blog: ${middleItem.blog}`;

    const location = document.createElement('p');
    location.classList.add('location');
    location.innerText = `location: ${middleItem.location}`;

    const memberSince = document.createElement('p');
    memberSince.classList.add('memberSince');
    memberSince.innerText = `Member Since: ${middleItem.memberSince}`;

    /* Latest Repos 구현 */
    console.log(repoItem);
    const reposEl = document.createElement('div');
    reposEl.classList.add('all-repo');

    const repoText = document.createElement('h2');
    repoText.innerText = 'Latest Repos';
    reposEl.appendChild(repoText);

    // repoItem 배열에 있는 객체들을 모두 보이게 하는 코드
    for (let i = 0; i < repoItem.length; i++) {
        const individualRepoEl = document.createElement('div');
        individualRepoEl.classList.add(`repo`);

        const repoElTitle = document.createElement('p');
        repoElTitle.classList.add(`repo-title`)
        repoElTitle.innerText = `${repoItem[i].title}`;
        individualRepoEl.appendChild(repoElTitle)

        const repoElStars = document.createElement('p');
        repoElStars.classList.add(`repo-stars`)
        repoElStars.innerText = `repo stars: ${repoItem[i].stars}`;
        individualRepoEl.appendChild(repoElStars)

        const repoElWatchers = document.createElement('p');
        repoElWatchers.classList.add(`repo-watchers`)
        repoElWatchers.innerText = `repo watchers: ${repoItem[i].watchers}`;
        individualRepoEl.appendChild(repoElWatchers)

        const repoElForks = document.createElement('p');
        repoElForks.classList.add(`repo-forks`)
        repoElForks.innerText = `repo forks: ${repoItem[i].forks}`;
        individualRepoEl.appendChild(repoElForks)

        reposEl.appendChild(individualRepoEl)
    }


    /* middleArea > middleEl, infoEl1, infoEl2 */
    // middleArea 영역에 middleEl 추가
    middleArea.appendChild(middleEl);
    middleEl.appendChild(imgEl);
    middleEl.appendChild(viewBtn);
    
    // middleArea 영역에 infoEl1 추가
    middleArea.appendChild(infoEl1);
    infoEl1.appendChild(publicRepoEl);
    infoEl1.appendChild(publicGistEl);
    infoEl1.appendChild(followersEl);
    infoEl1.appendChild(followingEl);
    
    // middleArea 영역에 infoEl2 추가
    middleArea.appendChild(infoEl2);
    infoEl2.appendChild(company);
    infoEl2.appendChild(blog);
    infoEl2.appendChild(location);
    infoEl2.appendChild(memberSince);

    // latestRepoArea 영역에 repo 추가
    latestRepoArea.appendChild(reposEl);


    return {middleEl, infoEl1, infoEl2};
}

function confirmGrass() {
    let username = document.getElementById("searchText").value;
    let grassUrl = `https://ghchart.rshah.org/${username}`;

    window.location.href = viewProfileURL;

}
