import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Grid, MenuItem, TextField, LinearProgress } from '@mui/material';

import resultService from 'src/services/resultService';
import districtService from 'src/services/districtService';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
// ----------------------------------------------------------------------

export default function SuaraCalegView() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [kecamatans, setKecamatans] = useState([]);
  const [kelurahans, setKelurahans] = useState([]);
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');

  const [calegs, setCalegs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleGetAllKecamatan();
  }, []);
  const handleGetAllKecamatan = async () => {
    try {
      setLoading(true);

      const getKecamatans = await districtService.getAllDistricts();
      const getCalegs = await resultService.getAllCalegs();
      setKecamatans(getKecamatans.data);
      setCalegs(getCalegs.data);

      setLoading(false);
    } catch (error) {
      setKecamatans([]);
      setLoading(false);
    }
  };

  const handleCalegByKecamatan = async (districtId) => {
    try {
      setCalegs([]);
      setKelurahan('');
      setLoading(true);
      const getCalegs = await resultService.getCalegByDistrictId(districtId);
      setCalegs(getCalegs.data);
      setLoading(false);
    } catch (error) {
      setCalegs([]);
      setKelurahan('');
      setLoading(false);
    }
  };

  const handleSelectedKelurahan = async (village_id) => {
    try {
      setLoading(true);
      setCalegs([]);
      setLoading(true);
      const getCalegs = await resultService.getCalegByVillageId(village_id);
      setCalegs(getCalegs.data);
      setLoading(false);
      setLoading(false);
    } catch (error) {
      setCalegs([]);
      setLoading(false);
    }
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: calegs,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Calon Legislatif</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        {kelurahan ? (
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Data di Kelurahan {kelurahan.village_name}
          </Typography>
        ) : (
          kecamatan && (
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Data di Kecamatan {kecamatan.district_name}
            </Typography>
          )
        )}
      </Stack>

      {loading && <LinearProgress color="primary" variant="query" />}
      {!loading && (
        <>
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Kecamatan"
                value={kecamatan}
                onChange={(e) => {
                  setKecamatan(e.target.value);
                  setKelurahans(e.target.value.villages);
                  handleCalegByKecamatan(e.target.value._id);
                  // console.log(e.target.value);
                }}
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Pilih Kecamatan
                </MenuItem>
                {kecamatans.map((option) => (
                  <MenuItem key={option._id} value={option}>
                    {option.district_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Kelurahan"
                value={kelurahan}
                onChange={(e) => {
                  setKelurahan(e.target.value);
                  console.log(e.target.value);
                  handleSelectedKelurahan(e.target.value._id);
                }}
                variant="outlined"
                disabled={!kecamatan}
              >
                <MenuItem value="" disabled>
                  Pilih Desa / Kelurahan
                </MenuItem>
                {kelurahans.map((option) => (
                  <MenuItem key={option._id} value={option}>
                    {option.village_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Card>
            <UserTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <UserTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleSort}
                    headLabel={[
                      { id: 'isVerified', label: 'No', align: 'center' },
                      { id: 'candidate_data.name', label: 'Nama' },
                      { id: 'party_name', label: 'Partai' },
                      { id: 'number_of_votes', label: 'Jumlah Suara' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <UserTableRow
                          key={row.candidate_id}
                          no={page * rowsPerPage + index + 1}
                          name={row.candidate_data.name}
                          role={row.number_of_votes}
                          company={row.party_name}
                        />
                      ))}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[10, 20, 30]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </>
      )}
    </Container>
  );
}
