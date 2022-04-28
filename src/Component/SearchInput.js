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
    border: 2px solid black;
    border-left: none;
    color: rgba(0, 0, 0, 0.65);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;

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

    border: 2px solid black;
    background-color: whitesmoke;
    border-right: none;

    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    cursor: pointer;
`;

export const SearchInput = ({
    searchField,
    changeValueCallback,
    searchCallback,
}) => {
    return (
        <SearchFrom onSubmit={searchCallback}>
            <Search viewBox="-5 -5 35 35" onClick={searchCallback} />

            <InputArea
                type="search"
                placeholder="今天想學習什麼?"
                value={searchField}
                onChange={changeValueCallback}
            />
        </SearchFrom>
    );
};
