import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, InputLabel } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import userService from 'src/services/userService';
import districtService from 'src/services/districtService';

import Iconify from 'src/components/iconify';

export default function EditUserDialog({ user }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    password: '',
    kecamatan: '',
    role: user.role,
    district_id: user.district_id?._id || '',
    village_id: user.village_id?._id || '',
  });

  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [kecamatans, setKecamatans] = useState([]);
  const [kelurahans, setKelurahans] = useState([]);

  useEffect(() => {
    handleGetKecamatans();
  }, []);

  const handleGetKecamatans = async () => {
    const getKecamatans = await districtService.getAllDistricts();
    if (getKecamatans.code === 200) {
      setKecamatans(getKecamatans.data);
    } else {
      setKecamatans([]);
    }
  };

  const handleEditUser = async () => {
    try {
      setLoading(true);

      if (formData.role === 'user_village') {
        formData.kecamatan = '';
        formData.district_id = '';
        console.log(formData);
      } else if (formData.role === 'user_district') {
        formData.kecamatan = '';
        formData.village_id = '';
        console.log(formData);
      } else {
        formData.district_id = '';
        formData.village_id = '';
        formData.kecamatan = '';
        console.log(formData);
      }

      const result = await userService.editUser(user._id, formData);

      if (result.code === 200) {
        enqueueSnackbar('Edit success', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          action: (key) => (
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => closeSnackbar(key)}
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
          ),
        });
        setLoading(false);
        window.location.reload();
      } else {
        enqueueSnackbar(result.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          action: (key) => (
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => closeSnackbar(key)}
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
          ),
        });
        setLoading(false);
      }
    } catch (error) {
      enqueueSnackbar('Edit failed', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        action: (key) => (
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => closeSnackbar(key)}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
        ),
      });
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MenuItem onClick={handleClickOpen}>
        <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
        Edit
      </MenuItem>
      <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Edit akun </DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            autoFocus
            defaultValue={user.username}
            margin="dense"
            id="username"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
          />

          <TextField
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />

          <div style={{ marginTop: '16px' }}>
            <InputLabel id="role-label">Peran</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              onChange={(e) => {
                setFormData({ ...formData, role: e.target.value, kecamatan: '', village_id: '' });
              }}
              fullWidth
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user_district">User Kecamatan</MenuItem>
              <MenuItem value="user_village">User Kelurahan</MenuItem>
            </Select>
          </div>

          {formData.role !== 'admin' && (
            <>
              <div style={{ marginTop: '16px' }}>
                <InputLabel id="kecamatan-label">Kecamatan</InputLabel>
                <Select
                  labelId="kecamatan-label"
                  id="kecamatan"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      kecamatan: e.target.value,
                      village_id: '',
                      district_id: e.target.value._id,
                    });

                    setKelurahans(e.target.value.villages);
                  }}
                  fullWidth
                >
                  {kecamatans.map((kecamatan) => (
                    <MenuItem key={kecamatan._id} value={kecamatan}>
                      {kecamatan.district_name}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              {formData.role === 'user_village' && (
                <div style={{ marginTop: '16px' }}>
                  <InputLabel id="kelurahan-label">Kelurahan</InputLabel>
                  <Select
                    disabled={!formData.kecamatan}
                    labelId="kelurahan-label"
                    id="kelurahan"
                    name="kelurahan"
                    value={formData.village_id}
                    onChange={(e) => setFormData({ ...formData, village_id: e.target.value })}
                    fullWidth
                  >
                    {kelurahans.map((kelurahan) => (
                      <MenuItem key={kelurahan._id} value={kelurahan._id}>
                        {kelurahan.village_name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button onClick={handleEditUser}>{loading ? 'Menyimpan...' : 'Simpan'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

EditUserDialog.propTypes = {
  user: PropTypes.any,
};