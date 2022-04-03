import React, { useEffect, useMemo } from 'react';
import { Typography, Paper, Button, Tooltip, withStyles } from '@material-ui/core';
import classes from './snaps.module.css';
import stores, { useAccount, useChain } from '../../stores/index.js';
import { ACCOUNT_CONFIGURED } from '../../stores/constants/constants';
import Image from 'next/image';
import { addSnaps, renderProviderText } from '../../utils/utils';

const ExpandButton = withStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '12px',
    marginBottom: '-24px',
  },
}))(Button);

export default function Snap({ snap }) {
  const account = useAccount((state) => state.account);
  const setAccount = useAccount((state) => state.setAccount);

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore('account');
      setAccount(accountStore);
    };

    stores.emitter.on(ACCOUNT_CONFIGURED, accountConfigure);

    const accountStore = stores.accountStore.getStore('account');
    setAccount(accountStore);

    return () => {
      stores.emitter.removeListener(ACCOUNT_CONFIGURED, accountConfigure);
    };
  }, []);

  const icon = useMemo(() => {
    return snap.iconUrl || '/unknown-logo.png';
  }, [snap]);

  const chainId = useChain((state) => state.id);
  const updateChain = useChain((state) => state.updateChain);

  const handleClick = () => {
    if (snap.chainId === chainId) {
      updateChain(null);
    } else {
      updateChain(snap.chainId);
    }
  };

  const showAddlInfo = true;


  if (!snap) {
    return <div></div>;
  }

  return (
    <>
      <Paper elevation={1} className={classes.chainContainer} key={snap.chainId}>
        <div className={classes.chainNameContainer}>
          <Image
            src={icon}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/chains/unknown-logo.png';
            }}
            width={28}
            height={28}
            className={classes.avatar}
          />

          <Tooltip title={snap.title}>
            <Typography variant="h3" className={classes.name} noWrap style={{ marginLeft: '24px' }}>
              <a href={snap.infoURL} target="_blank" rel="noreferrer">
                {snap.title}
              </a>
            </Typography>
          </Tooltip>
        </div>
        <div className={classes.snapInfoContainer}>
          <div className={classes.dataPoint}>
            <Typography variant="subtitle1" color="textSecondary" className={classes.dataPointHeader}>
              Creator
            </Typography>
            <Typography variant="h5">{snap.creator}</Typography>
          </div>
          <div className={classes.dataPoint}>
            <Typography variant="subtitle1" color="textSecondary" className={classes.dataPointHeader}>
              Version
            </Typography>
            <Typography variant="h5">{snap.version || 'none'}</Typography>
          </div>
        </div>
        <div className={classes.addButton}>
          <Button variant="outlined" color="primary" onClick={() => addSnaps(account, snap)}>
            {renderProviderText(account)}
          </Button>
        </div>
      </Paper>
    </>
  );
}
