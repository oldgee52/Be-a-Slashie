import ReactPaginate from "react-paginate";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CourseInfo } from "./CourseInfo";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { breakPoint } from "../utils/breakPoint";
import { useCustomDateDisplay } from "../customHooks/useCustomDateDisplay";

const MyPaginate = styled(ReactPaginate).attrs({
    activeClassName: "active",
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
    margin-top: 80px;
    opacity: ${props => (props.active ? 0 : 1)};
    z-index: ${props => (props.active ? -1 : 0)};
`;

const CourseArea = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 10px 0 10px;
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

function PaginatedItems({ itemsPerPage, searchData }) {
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);

    const [itemOffset, setItemOffset] = useState(0);
    const customDateDisplay = useCustomDateDisplay();

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(searchData.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(searchData?.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, searchData]);

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
                                creatDate={customDateDisplay(
                                    course.creatTime.seconds * 1000,
                                )}
                                openingDate={customDateDisplay(
                                    course.openingDate.seconds * 1000,
                                )}
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
        </>
    );
}
export default PaginatedItems;
