import ReactPaginate from "react-paginate";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

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
                        <p>{item.view}</p>
                    </div>
                ))}
        </div>
    );
}

function PaginatedItems({ itemsPerPage, courses }) {
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
        setCurrentItems(courses.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(courses?.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, courses]);

    // Invoke when user click to request another page.
    const handlePageClick = event => {
        const newOffset = (event.selected * itemsPerPage) % courses.length;
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
                renderOnZeroPageCount={null}
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
