import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Input, Form, Spin, Button } from 'antd';
import { useWallet, useWalletRequest } from 'ui/utils';
import UnlockLogo from 'ui/assets/unlock-logo.svg';

const MINIMUM_PASSWORD_LENGTH = 8;

const CreatePassword = () => {
  const history = useHistory();
  const wallet = useWallet();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [run, loading] = useWalletRequest(wallet.boot, {
    onSuccess() {
      history.replace('/no-address');
    },
    onError(err) {
      form.setFields([
        {
          name: 'password',
          errors: [err?.message || t('incorrect password')],
        },
      ]);
    },
  });

  const init = async () => {
    if ((await wallet.isBooted()) && !(await wallet.isUnlocked())) {
      history.replace('/unlock');
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Spin spinning={loading} size="large">
      <div className="rabby-container h-full" style={{ background: '#F5F6FA' }}>
        <Form
          onFinish={({ password }) => run(password.trim())}
          form={form}
          validateTrigger="onBlur"
        >
          <header className="create-new-header create-password-header h-[264px]">
            <img
              className="rabby-logo"
              src="/images/logo-white.svg"
              alt="rabby logo"
            />
            <img
              className="unlock-logo w-[128px] h-[128px] mx-auto"
              src={UnlockLogo}
            />
            <p className="text-24 mb-4 mt-0 text-white text-center font-bold">
              {t('Set Unlock Password')}
            </p>
            <p className="text-14 mb-0 mt-4 text-white opacity-80 text-center">
              {t('This password will be used to unlock your wallet')}
            </p>
            <img src="/images/create-password-mask.png" className="mask" />
          </header>
          <div className="p-32">
            <Form.Item
              className="mb-0 h-60 overflow-hidden"
              name="password"
              help=""
              validateTrigger="submit"
              rules={[
                {
                  required: true,
                  message: t('Please input Password'),
                },
                {
                  min: MINIMUM_PASSWORD_LENGTH,
                  message: (
                    <Trans
                      i18nKey="passwordMinimumLengthAlert"
                      values={{ length: MINIMUM_PASSWORD_LENGTH }}
                    />
                  ),
                },
                ({ getFieldValue }) => ({
                  validator(_, value: string) {
                    if (!value || getFieldValue('confirmPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t('Two inputs do not match'))
                    );
                  },
                }),
              ]}
            >
              <Input
                size="large"
                placeholder={t('Password')}
                type="password"
                autoFocus
                spellCheck={false}
              />
            </Form.Item>
            <Form.Item
              className="mb-0 h-[56px] overflow-hidden"
              name="confirmPassword"
              help=""
            >
              <Input
                size="large"
                placeholder={t('Repeat Password')}
                type="password"
                spellCheck={false}
              />
            </Form.Item>
            <Form.Item
              shouldUpdate
              className="text-red-light text-12 mb-[98px]"
            >
              {() => (
                <Form.ErrorList
                  errors={[
                    form
                      .getFieldsError()
                      .map((x) => x.errors)
                      .reduce((m, n) => m.concat(n), [])[0],
                  ]}
                />
              )}
            </Form.Item>
            <Button type="primary" size="large" block htmlType="submit">
              Next
            </Button>
          </div>
        </Form>
      </div>
    </Spin>
  );
};

export default CreatePassword;
