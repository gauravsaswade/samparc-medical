import { useEffect, useRef } from 'react';
import { useActor } from './useActor';
import { SellerStatus } from '../backend';

const SEED_EMAIL = 'gauravsaswade2009@gmail.com';
const SEED_PASSWORD_HASH = 'ebbf71afae35a6480efa95acffa5031a1b4e245cc9f2bb04ef0b6cff31969855';

export function useSeedAdminSeller() {
  const { actor, isFetching } = useActor();
  const seededRef = useRef(false);

  useEffect(() => {
    if (!actor || isFetching || seededRef.current) return;

    seededRef.current = true;

    (async () => {
      try {
        const existing = await actor.getSellerByEmail(SEED_EMAIL);

        if (existing === null || existing === undefined) {
          // Seller doesn't exist — register and then approve
          const sellerId = await actor.registerSeller(
            'Gaurav Saswade',
            SEED_EMAIL,
            '',
            'SAMPARC MEDICAL',
            SEED_PASSWORD_HASH,
            []
          );
          await actor.updateSellerStatus(sellerId, SellerStatus.Approved);
        } else if (existing.status !== SellerStatus.Approved) {
          // Seller exists but is not yet approved
          await actor.updateSellerStatus(existing.id, SellerStatus.Approved);
        }
      } catch {
        // Silently ignore initialization errors
      }
    })();
  }, [actor, isFetching]);
}
