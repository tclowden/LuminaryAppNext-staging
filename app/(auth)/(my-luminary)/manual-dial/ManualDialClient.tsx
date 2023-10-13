import ManualDialer from '../../../../common/components/manual-dialer/ManualDialer';
import PageContainer from '../../../../common/components/page-container/PageContainer';

type Props = {};

const ManualDialClient = ({}: Props) => {
   return (
      <PageContainer>
         <ManualDialer />
      </PageContainer>
   );
};

export default ManualDialClient;
