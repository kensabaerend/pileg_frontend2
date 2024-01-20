import { Helmet } from 'react-helmet-async';

import { PengisianPencoblosView } from 'src/sections/pengisian_pencoblos/view';

// ----------------------------------------------------------------------

export default function PengisianPencoblosPage() {
  return (
    <>
      <Helmet>
        <title> Pengisian Jumlah Pemilih | Pemilihan Legislatif </title>
      </Helmet>

      <PengisianPencoblosView />
    </>
  );
}
