import PropTypes from 'prop-types';
// @mui
import { TablePagination } from '@mui/material';

CaiGouPagination.propTypes = {
  search: PropTypes.object,
  total: PropTypes.number,
  pagination: PropTypes.object,
  setP: PropTypes.func,
  getList: PropTypes.func,
};

export default function CaiGouPagination({ search, total, pagination, setP, getList }) {
  const handleChangeRowsPerPage = (event) => {
    const newP = { ...pagination, pageSize: parseInt(event.target.value, 10) };
    setP(newP);
    getList({ ...search, ...newP });
  };
  const handlePageChange = (value) => {
    const newP = { ...pagination, pageIndex: value };
    setP(newP);
    getList({ ...search, ...newP });
  };

  return (
    <TablePagination
      rowsPerPageOptions={[10, 20, 30]}
      component="div"
      count={total}
      rowsPerPage={pagination.pageSize}
      page={pagination.pageIndex}
      onPageChange={(event, value) => handlePageChange(value)}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}
