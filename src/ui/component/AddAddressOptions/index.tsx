import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { openInternalPageInTab } from 'ui/utils/webapi';

import IconWalletConnect from 'ui/assets/walletlogo/walletconnect.png';
import IconCreatenewaddr from 'ui/assets/walletlogo/createnewaddr.svg';
import IconImportAdress from 'ui/assets/walletlogo/import-address.svg';
import IconAddwatchmodo from 'ui/assets/walletlogo/addwatchmode.svg';
import IconHardWallet from 'ui/assets/address/hardwallet.svg';
import IconMobileWallet from 'ui/assets/address/mobile-wallet.svg';
import InstitutionalWallet from 'ui/assets/address/institutional-wallet.svg';
import IconMetamask from 'ui/assets/dashboard/icon-metamask.svg';

import './style.less';

import {
  IS_CHROME,
  WALLET_BRAND_CONTENT,
  BRAND_WALLET_CONNECT_TYPE,
  WALLET_BRAND_TYPES,
} from 'consts';

import clsx from 'clsx';
import _ from 'lodash';
import { connectStore } from '@/ui/store';
import { Item } from '../Item';

const walletSortObj = [
  //mobile
  WALLET_BRAND_TYPES.METAMASK,
  WALLET_BRAND_TYPES.TRUSTWALLET,
  WALLET_BRAND_TYPES.IMTOKEN,
  WALLET_BRAND_TYPES.TP,
  WALLET_BRAND_TYPES.MATHWALLET,
  WALLET_BRAND_TYPES.DEFIANT,
  //hard wallet
  WALLET_BRAND_TYPES.LEDGER,
  WALLET_BRAND_TYPES.TREZOR,
  WALLET_BRAND_TYPES.GRIDPLUS,
  WALLET_BRAND_TYPES.ONEKEY,
  WALLET_BRAND_TYPES.KEYSTONE,
  WALLET_BRAND_TYPES.BITBOX02,
  WALLET_BRAND_TYPES.COOLWALLET,
  WALLET_BRAND_TYPES.AIRGAP,
  //institutional
  WALLET_BRAND_TYPES.GNOSIS,
  WALLET_BRAND_TYPES.FIREBLOCKS,
  WALLET_BRAND_TYPES.AMBER,
  WALLET_BRAND_TYPES.COBO,
  WALLET_BRAND_TYPES.JADE,
].reduce((pre, now, i) => {
  pre[now] = i + 1;
  return pre;
}, {} as { [k: string]: number });

const getSortNum = (s: string) => walletSortObj[s] || 999999;

const AddAddressOptions = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const [selectedWalletType, setSelectedWalletType] = useState('');

  type Valueof<T> = T[keyof T];
  const connectRouter = React.useCallback(
    (item: Valueof<typeof WALLET_BRAND_CONTENT>) => {
      if (item.connectType === 'BitBox02Connect') {
        openInternalPageInTab('import/hardware?connectType=BITBOX02');
      } else if (item.connectType === 'GridPlusConnect') {
        openInternalPageInTab('import/hardware?connectType=GRIDPLUS');
      } else if (item.connectType === 'TrezorConnect') {
        openInternalPageInTab('import/hardware?connectType=TREZOR');
      } else if (item.connectType === 'LedgerConnect') {
        openInternalPageInTab(
          IS_CHROME
            ? 'import/hardware/ledger-connect'
            : 'import/hardware/ledger'
        );
      } else if (item.connectType === 'OneKeyConnect') {
        openInternalPageInTab('import/hardware?connectType=ONEKEY');
      } else if (item.connectType === 'GnosisConnect') {
        history.push({
          pathname: '/import/gnosis',
        });
      } else if (item.connectType === BRAND_WALLET_CONNECT_TYPE.QRCodeBase) {
        history.push({
          pathname: '/import/qrcode',
          state: {
            brand: item.brand,
          },
        });
      } else {
        history.push({
          pathname: '/import/wallet-connect',
          state: {
            brand: item,
          },
        });
      }
    },
    []
  );
  const brandWallet = React.useMemo(
    () =>
      Object.values(WALLET_BRAND_CONTENT)
        .map((item) => {
          return {
            leftIcon: item.image,
            content: t(item.name),
            brand: item.brand,
            connectType: item.connectType,
            image: item.image,
            onClick: () => connectRouter(item),
            category: item.category,
          };
        })
        .filter(Boolean)
        .sort((a, b) => getSortNum(a.brand) - getSortNum(b.brand)),
    [t, connectRouter]
  );

  const wallets = React.useMemo(() => _.groupBy(brandWallet, 'category'), [
    brandWallet,
  ]);

  const renderList = React.useMemo(
    () =>
      [
        {
          title: 'Connect Hardware Wallets',
          key: 'hardware',
          icon: IconHardWallet,
        },
        {
          title: 'Connect Mobile Wallet Apps',
          key: 'mobile',
          icon: InstitutionalWallet,
        },
        {
          title: 'Connect Institutional Wallets',
          key: 'institutional',
          icon: IconMobileWallet,
        },
      ]
        .map((item) => {
          return {
            ...item,
            values: wallets[item.key],
          };
        })
        .filter((item) => item.values),
    [wallets]
  );

  const createIMportAddrList = React.useMemo(
    () => [
      {
        leftIcon: IconCreatenewaddr,
        content: t('createAddress'),
        brand: 'createAddress',
        onClick: async () => {
          history.push('/mnemonics/create');
        },
      },
      {
        leftIcon: IconImportAdress,
        brand: 'importAddress',
        content: 'Import Address',
        onClick: () => history.push('/import/entry-import-address'),
      },
    ],
    [t]
  );

  const centerList = React.useMemo(
    () => [
      {
        leftIcon: IconMetamask,
        brand: 'addMetaMaskAccount',
        content: 'Import My MetaMask Account',
        onClick: () => history.push('/import/metamask'),
      },
    ],
    []
  );

  const bottomList = React.useMemo(
    () => [
      {
        leftIcon: IconAddwatchmodo,
        brand: 'addWatchMode',
        content: 'Watch Mode Address',
        subText: t('Add address without private keys'),
        onClick: () => history.push('/import/watch-address'),
      },
    ],
    [t]
  );

  return (
    <div className="rabby-container">
      {[createIMportAddrList, centerList].map((items) => (
        <div className="bg-white rounded-[6px] mb-[20px]">
          {items.map((e) => {
            return (
              <Item key={e.brand} leftIcon={e.leftIcon} onClick={e.onClick}>
                <div className="pl-[12px] text-13 leading-[15px] text-gray-title font-medium">
                  {e.content}
                </div>
              </Item>
            );
          })}
        </div>
      ))}

      <div className="bg-white rounded-[6px] mb-[20px]">
        {renderList.map((item) => {
          const isSelected = selectedWalletType === item.key;
          return (
            <div key={item.key} className={clsx(isSelected && 'pb-[16px]')}>
              <Item
                hoverBorder={false}
                leftIcon={item.icon}
                className="bg-transparent"
                rightIconClassName={clsx(
                  'ml-[8px] transition-transform',
                  isSelected ? '-rotate-90' : 'rotate-90'
                )}
                onClick={() => {
                  setSelectedWalletType((v) =>
                    v === item.key ? '' : item.key
                  );
                }}
              >
                <div className="pl-[12px] text-13 leading-[15px] text-gray-title font-medium">
                  {item.title}
                </div>
                <div className="ml-auto relative w-[52px] h-[20px]">
                  {item.values.slice(0, 3).map((wallet, i) => (
                    <img
                      key={wallet.image}
                      src={wallet.leftIcon || wallet.image}
                      className="absolute top-0 w-[20px] h-[20px] select-none"
                      onDragStart={() => false}
                      style={{
                        left: 0 + 16 * i,
                      }}
                    />
                  ))}
                </div>
              </Item>
              <div
                className={clsx(
                  'mx-[16px] bg-gray-bg2 rounded-[6px] transition-all  overflow-hidden',
                  !isSelected ? 'max-h-0' : 'max-h-[500px]'
                )}
              >
                <div className="py-[8px] grid grid-cols-3 gap-x-0">
                  {item.values.map((v) => {
                    return (
                      <Item
                        bgColor="transparent"
                        className="flex-col justify-center hover:border-transparent"
                        py={10}
                        px={0}
                        key={v.brand}
                        left={
                          <div className="relative w-[28px] h-[28px]">
                            <img
                              src={v.image}
                              className="w-[28px] h-[28px] rounded-full"
                            />
                            {v.connectType === 'WalletConnect' && (
                              <img
                                src={IconWalletConnect}
                                className="absolute -top-6 -right-6 w-[14px] h-[14px] rounded-full"
                              />
                            )}
                          </div>
                        }
                        rightIcon={null}
                        onClick={v.onClick}
                      >
                        <span className="text-12 font-medium text-gray-title mt-[8px]">
                          {v.content}
                        </span>
                      </Item>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[6px] mb-[20px]">
        {bottomList.map((e) => {
          return (
            <Item key={e.brand} leftIcon={e.leftIcon} onClick={e.onClick}>
              <div className="flex flex-col pl-[12px]">
                <div className=" text-13 leading-[15px] text-gray-title font-medium">
                  {e.content}
                </div>
                <div className="text-12 text-gray-subTitle">{e.subText}</div>
              </div>
            </Item>
          );
        })}
      </div>
    </div>
  );
};

export default connectStore()(AddAddressOptions);
