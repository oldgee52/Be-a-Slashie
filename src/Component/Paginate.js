import ReactPaginate from "react-paginate";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const items = [
    {
        title: "課程1",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "1",
        courseIntroduction: "這是一堂有趣的課",
        teacherUserID: "55",
    },
    {
        title: "韓語課程",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "2",
        courseIntroduction: "這是一堂快速學習韓語的課",
        teacherUserID: "66",
    },
    {
        title: "JavaScript 入門課程",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "3",
        courseIntroduction: "這是一堂給踏入前端開發人員的第一步",
        teacherUserID: "77",
    },
    {
        title: "HTML CSS 進階",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "4",
        courseIntroduction: "這是一堂給有基礎的人",
        teacherUserID: "88",
    },
    {
        title: "課程5",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "5",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程6",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "6",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程7",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "7",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "8",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "9",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "10",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "11",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "12",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "13",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "14",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "15",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "16",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },

    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "17",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "18",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },

    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "19",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "20",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },

    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "21",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },

    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "22",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "23",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "24",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },

    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "25",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
    {
        title: "課程8",
        image: "https://upload.cc/i1/2022/04/02/Ow1X0s.png",
        courseID: "26",
        courseIntroduction: "這是一堂無聊的課",
        teacherUserID: "99",
    },
];

// You can style your pagination component
// thanks to styled-components.
// Use inner class names to style the controls.
const MyPaginate = styled(ReactPaginate).attrs({
    // You can redifine classes here, if you want.
    activeClassName: "active", // default to "disabled"
})`
    margin-bottom: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    list-style-type: none;
    padding: 0 5rem;
    li a {
        border-radius: 7px;
        padding: 0.1rem 1rem;
        border: gray 1px solid;
        cursor: pointer;
    }
    li.previous a,
    li.next a,
    li.break a {
        border-color: transparent;
    }
    li.active a {
        background-color: #0366d6;
        border-color: transparent;
        color: white;
        min-width: 32px;
    }
    li.disabled a {
        color: grey;
    }
    li.disable,
    li.disabled a {
        cursor: default;
    }
`;

function Items({ currentItems }) {
    return (
        <div className="items">
            {currentItems &&
                currentItems.map(item => (
                    <div key={item.courseID}>
                        <h3>{item.title}</h3>
                        <p>{item.courseIntroduction}</p>
                    </div>
                ))}
        </div>
    );
}

function PaginatedItems({ itemsPerPage }) {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(items.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(items.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);

    // Invoke when user click to request another page.
    const handlePageClick = event => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`,
        );
        setItemOffset(newOffset);
    };

    return (
        <>
            <Items currentItems={currentItems} />
            <MyPaginate
                pageCount={pageCount}
                onPageChange={handlePageClick}
                nextLabel="next"
            />
            {/* <ReactPaginate
                nextLabel="next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                previousLabel="previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            /> */}
        </>
    );
}
export default PaginatedItems;
