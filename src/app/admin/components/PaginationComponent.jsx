import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const PaginationComponent = ({ count, page, onPageChange }) => {
    return (
        <div className="flex justify-center mt-4">
            <Stack spacing={2}>
                <Pagination
                    count={count}
                    page={page}
                    onChange={onPageChange}
                    color="primary"
                    shape="rounded"
                />
            </Stack>
        </div>
    );
};

export default PaginationComponent;