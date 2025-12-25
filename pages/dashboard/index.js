export default function DashboardIndex() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/dashboard/profile',
      permanent: false,
    },
  };
}
