// Button Status
const buttonStatus = document.querySelectorAll('[button-status]');
//thuộc tính tự định nghĩa là phải thêm dấu ngoặc vuông
if(buttonStatus.length > 0){
    let url = new URL(window.location.href);

    buttonStatus.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute("button-status");
            
            if(status) {
                url.searchParams.set("status", status);
            }else{
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    });
}

// End Button Status

// Form Search
const formSearch = document.querySelector('#form-search');
if(formSearch){
    let url = new URL(window.location.href);
    formSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if(keyword){
            url.searchParams.set("keyword", keyword);
        }else{
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    });
}

// End Form Search

//Pagination
    const buttonsPagination = document.querySelectorAll("[button-pagination]");
    
    if(buttonsPagination.length > 0){
        let url = new URL(window.location.href);

        buttonsPagination.forEach(button => {
            button.addEventListener('click', () => {
                const page = button.getAttribute("button-pagination");
                if(page){
                    url.searchParams.set("page", page);
                }else{
                    url.searchParams.delete("page");
                }

                window.location.href = url.href;
            });
        });      
    }

//End Pagination