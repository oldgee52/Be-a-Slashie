import React from "react";
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";
import { breakPoint } from "../utils/breakPoint";

const SearchFrom = styled.form`
    width: 100%;
    display: flex;
    justify-content: center;
    @media ${breakPoint.desktop} {
        justify-content: flex-start;
    }
`;

const InputArea = styled.input`
    width: 100%;
    height: 30px;
    background: whitesmoke;
    border: 1px solid #7f7f7f;
    border-left: none;
    border-right: none;
    color: #505050;
    border-radius: 0;
    -webkit-appearance: none;
    &::placeholder {
        font-family: "Noto Sans TC", "微軟正黑體", "Arial", sans-serif;
        letter-spacing: 1px;
        font-weight: 500;
    }
    /* &:-moz-placeholder {
        font-family: "Noto Sans TC", "微軟正黑體", "Arial", sans-serif;
    }
    &::-moz-input-placeholder {
        font-family: "Noto Sans TC", "微軟正黑體", "Arial", sans-serif;
    }
    &::-webkit-input-placeholder {
        font-family: "Noto Sans TC", "微軟正黑體", "Arial", sans-serif;
    }
    &:-ms-input-placeholder {
        font-family: "Noto Sans TC", "微軟正黑體", "Arial", sans-serif;
    } */
    /* border-top-right-radius: 10px;
    border-bottom-right-radius: 10px; */

    font-weight: 600;

    &:focus {
        outline: none;
    }

    /* @media ${breakPoint.desktop} {
        width: 350px;
    } */
`;

const Search = styled(FiSearch)`
    width: 30px;
    height: 30px;

    border: 1px solid #7f7f7f;
    background-color: whitesmoke;
    border-right: none;

    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    cursor: pointer;
`;
const DeleteButton = styled.span`
    width: 30px;
    height: 30px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: whitesmoke;
    border: 1px solid #7f7f7f;

    border-left: none;

    &::before {
        content: "x";
        opacity: ${props => (props.active ? "1" : "0")};
        position: absolute;
        left: 8px;
        top: 3px;
        transition-duration: 0.2s;
    }
    &:hover {
        cursor: ${props => (props.active ? "pointer" : "default")};
    }
`;

export const SearchInput = ({
    searchField,
    setSearchField,
    changeValueCallback,
    searchCallback,
    placeholderText,
}) => {
    return (
        <SearchFrom onSubmit={searchCallback}>
            <Search viewBox="-5 -5 35 35" onClick={searchCallback} />

            <InputArea
                placeholder={placeholderText}
                value={searchField}
                onChange={changeValueCallback}
            />
            <DeleteButton
                active={searchField !== ""}
                onClick={() => setSearchField("")}
            />
        </SearchFrom>
    );
};
