import ReactPaginate from "react-paginate";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CourseInfo } from "./CourseInfo";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { breakPoint } from "../utils/breakPoint";

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
    justify-content: space-around;
    list-style-type: none;
    padding: 0 5rem;
    li a {
        border-radius: 7px;
        padding: 0.1rem 1rem;
        /* border: gray 1px solid; */
        cursor: pointer;
    }
    li.previous a,
    li.next a,
    li.break a {
        border-color: transparent;
        color: #ff6100;
    }
    li.active a {
        background-color: #ff6100;
        /* border-color: transparent; */
        color: white;
        min-width: 32px;
    }
    li.disabled a {
        opacity: 0;
    }
    li.disable,
    li.disabled a {
        cursor: default;
    }
`;

const PaginateArea = styled.div`
    margin: auto;
    margin-top: 130px;
    opacity: ${props => (props.active ? 0 : 1)};
    z-index: ${props => (props.active ? -1 : 0)};
`;

const CourseArea = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 10px 0 10px;
    /* margin-bottom: 100px; */
    @media ${breakPoint.desktop} {
        justify-content: space-between;
        align-items: flex-start;
        &::after {
            content: "";
            width: calc(33.3% - 30px);
        }
    }
`;

const CourseDiv = styled.div`
    width: 100%;
    margin-top: 20px;

    @media ${breakPoint.desktop} {
        width: calc(33.3% - 30px);
        margin-top: 50px;
    }
`;

function Items({ currentItems }) {
    return (
        <div className="items">
            {currentItems &&
                currentItems.map(item => (
                    <div key={item.courseID}>
                        <a href={`/course?courseID=${item.courseID}`}>
                            <h3>{item.title}</h3>
                            <p>{item.courseIntroduction}</p>
                            <p>{item.view}</p>
                        </a>
                    </div>
                ))}
        </div>
    );
}

function PaginatedItems({ itemsPerPage, searchData }) {
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
        setCurrentItems(searchData.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(searchData?.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, searchData]);

    // Invoke when user click to request another page.
    const handlePageClick = event => {
        const newOffset = (event.selected * itemsPerPage) % searchData.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`,
        );
        setItemOffset(newOffset);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    console.log(pageCount);

    return (
        <>
            <CourseArea>
                {currentItems &&
                    currentItems.map(course => (
                        <CourseDiv key={course.courseID}>
                            <CourseInfo
                                teacherPhoto={course.teacherInfo.photo}
                                image={course.image}
                                courseID={course.courseID}
                                title={course.title}
                                teacherName={course.teacherInfo.name}
                                view={course.view}
                                creatDate={new Date(
                                    course.creatTime.seconds * 1000,
                                ).toLocaleDateString()}
                                openingDate={new Date(
                                    course.openingDate.seconds * 1000,
                                ).toLocaleDateString()}
                            />
                        </CourseDiv>
                    ))}
            </CourseArea>
            <PaginateArea active={pageCount === 1}>
                <MyPaginate
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    renderOnZeroPageCount={null}
                    previousLabel={<MdKeyboardArrowLeft />}
                    nextLabel={<MdKeyboardArrowRight />}
                />
            </PaginateArea>
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
