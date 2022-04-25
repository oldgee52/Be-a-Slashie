import React from "react";
import styled from "styled-components";

const InputArea = styled.input`
    width: 100%;
`;

const Button = styled.button`
    width: 100%;
`;

export const SearchInput = ({
    searchField,
    changeValueCallback,
    searchCallback,
    searchKeyDownCallback,
}) => {
    return (
        <>
            <InputArea
                type="search"
                placeholder="Search"
                value={searchField}
                onChange={changeValueCallback}
            />
            <Button onClick={searchCallback} onKeyDown={searchKeyDownCallback}>
                送出
            </Button>
        </>
    );
};
