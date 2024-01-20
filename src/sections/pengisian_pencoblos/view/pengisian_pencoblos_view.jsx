import { useState } from 'react';

import Container from '@mui/material/Container';
import {
  Grid,
  Table,
  Paper,
  Button,
  MenuItem,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

// ----------------------------------------------------------------------



export default function PengisianPencoblosView() {

  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [numberOfJumlahPemilih, setNumberOfJumlahPemilih] = useState(0); // New state for the number of JumlahPemilih

  const dummyKecamatan = [
    { id: '1', name: 'Kecamatan A' },
    { id: '2', name: 'Kecamatan B' },
    { id: '3', name: 'Kecamatan C' },
  ];

  const dummyKelurahan = [
    { id: '1', name: 'Kelurahan 1', kecamatanId: '1' },
    { id: '2', name: 'Kelurahan 2', kecamatanId: '2' },
    { id: '3', name: 'Kelurahan 3', kecamatanId: '3' },
  ];

  const [history] = useState([
    { id: 1, date: '2022-01-01', user: 'John Doe', action: 'Submitted' },
    { id: 2, date: '2022-01-02', user: 'Jane Smith', action: 'Updated' },
    // Add more history items as needed
  ]);

  const handleNumberOfJumlahPemilihChange = (e) => {
    const newNumberOfJumlahPemilih = parseInt(e.target.value, 10);
    setNumberOfJumlahPemilih(newNumberOfJumlahPemilih);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Pengisian Jumlah Pemilih
      </Typography>

      <Grid container spacing={3} mb={5}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            // onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Kecamatan"
            value={kecamatan}
            onChange={(e) => setKecamatan(e.target.value)}
            variant="outlined"
          >
            {/* Replace with actual kecamatan options */}
            {dummyKecamatan.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
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
            onChange={(e) => setKelurahan(e.target.value)}
            variant="outlined"
            disabled={!kecamatan} // Disable kelurahan select until kecamatan is selected
          >
            {/* Replace with actual kelurahan options */}
            {dummyKelurahan.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>






      <Grid container spacing={3} mb={5}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Masukan Jumlah TPS"
            variant="outlined"
            type="number"
            value={numberOfJumlahPemilih}
            onChange={handleNumberOfJumlahPemilihChange}
          />
        </Grid>
        {/* Dynamically generate vote input fields based on the number of JumlahPemilih */}
        {Array.from({ length: numberOfJumlahPemilih }).map((_, index) => (
          <Grid item xs={3} key={index}>
            <TextField
              fullWidth
              label={`TPS ${index + 1}`}
              variant="outlined"
              type="number"
              // Add any necessary state or onChange logic here
            />
          </Grid>
        ))}
      </Grid>






























      <Grid item xs={12} mb={5}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Grid>

      <Grid container spacing={3} mb={5}>
        {/* New Grid for History */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Riwayat Perubahan
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.user}</TableCell>
                    <TableCell>
                      <Button>Lihat</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}
