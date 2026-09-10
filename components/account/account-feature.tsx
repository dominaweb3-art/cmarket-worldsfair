import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { PublicKey } from '@solana/web3.js'
import { useCallback, useMemo, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'

import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AppPage } from '@/components/app-page'
import { AccountUiBalance } from '@/components/account/account-ui-balance'
import { AccountUiTokenAccounts } from '@/components/account/account-ui-token-accounts'
import { useGetBalanceInvalidate } from '@/components/account/use-get-balance'
import { useGetTokenAccountsInvalidate } from '@/components/account/use-get-token-accounts'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { ellipsify } from '@/utils/ellipsify'

import { AccountUiButtons } from './account-ui-buttons'

const C10_ALLOCATION = [
  { symbol: 'SOL', name: 'Solana', percent: 30, color: '#9945FF' },
  { symbol: 'USDC', name: 'USD Coin', percent: 25, color: '#2775CA' },
  { symbol: 'JitoSOL', name: 'Liquid staking', percent: 20, color: '#61D6A4' },
  { symbol: 'ETH', name: 'Ethereum', percent: 15, color: '#627EEA' },
  { symbol: 'BTC', name: 'Bitcoin', percent: 10, color: '#F7931A' },
]

export function AccountFeature() {
  const { account } = useMobileWallet()
  const [refreshing, setRefreshing] = useState(false)

  // account.address es texto; aquí lo convertimos a PublicKey real
  const walletAddress = useMemo(() => {
    if (!account?.address) {
      return undefined
    }

    return new PublicKey(account.address)
  }, [account?.address])

  const invalidateBalance = useGetBalanceInvalidate({
    address: walletAddress as PublicKey,
  })

  const invalidateTokenAccounts = useGetTokenAccountsInvalidate({
    address: walletAddress as PublicKey,
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)

    try {
      await Promise.all([
        invalidateBalance(),
        invalidateTokenAccounts(),
      ])
    } finally {
      setRefreshing(false)
    }
  }, [invalidateBalance, invalidateTokenAccounts])

  return (
    <AppPage>
      {account && walletAddress ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void onRefresh()}
            />
          }
          contentContainerStyle={styles.content}
        >
          <AppView style={styles.header}>
            <AppText type="title">C10 Market</AppText>

            <AppText style={styles.muted}>
              Tu índice diversificado sobre Solana
            </AppText>
          </AppView>

          <AppView style={styles.indexCard}>
            <View style={styles.topRow}>
              <View style={{ flex: 1 }}>
                <AppText style={styles.eyebrow}>C10 INDEX</AppText>

                <AppText type="subtitle">
                  Una canasta. Menos complejidad.
                </AppText>
              </View>

              <View style={styles.badge}>
                <AppText style={styles.badgeText}>DEVNET</AppText>
              </View>
            </View>

            <AppText style={styles.muted}>
              Asignación objetivo del MVP
            </AppText>

            <View style={styles.allocationBar}>
              {C10_ALLOCATION.map((asset) => (
                <View
                  key={asset.symbol}
                  style={{
                    flex: asset.percent,
                    backgroundColor: asset.color,
                  }}
                />
              ))}
            </View>

            <View style={styles.assetList}>
              {C10_ALLOCATION.map((asset) => (
                <View key={asset.symbol} style={styles.assetRow}>
                  <View style={styles.assetName}>
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: asset.color },
                      ]}
                    />

                    <View>
                      <AppText type="defaultSemiBold">
                        {asset.symbol}
                      </AppText>

                      <AppText style={styles.muted}>
                        {asset.name}
                      </AppText>
                    </View>
                  </View>

                  <AppText type="defaultSemiBold">
                    {asset.percent}%
                  </AppText>
                </View>
              ))}
            </View>

            <AppText style={styles.previewNote}>
              Vista previa de composición. La ejecución on-chain se añadirá en
              el siguiente paso.
            </AppText>
          </AppView>

          <AppView style={styles.walletCard}>
            <AppText style={styles.eyebrow}>
              WALLET CONNECTED
            </AppText>

            <AccountUiBalance address={walletAddress} />

            <AppText style={styles.muted}>
              {ellipsify(walletAddress.toBase58(), 8)}
            </AppText>
          </AppView>

          <AppView style={styles.tools}>
            <AppText type="subtitle">Wallet tools</AppText>
            <AccountUiButtons />
          </AppView>

          <AppView style={styles.tokens}>
            <AccountUiTokenAccounts address={walletAddress} />
          </AppView>
        </ScrollView>
      ) : (
        <AppView style={styles.connect}>
          <AppText>Connect your wallet.</AppText>
          <WalletUiButtonConnect />
        </AppView>
      )}
    </AppPage>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    gap: 4,
    paddingTop: 8,
  },
  indexCard: {
    padding: 18,
    gap: 14,
    borderRadius: 22,
    backgroundColor: '#20212A',
  },
  walletCard: {
    padding: 18,
    gap: 8,
    borderRadius: 22,
    backgroundColor: '#20212A',
  },
  tools: {
    gap: 12,
  },
  tokens: {
    marginTop: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  eyebrow: {
    color: '#9B9BA8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  muted: {
    color: '#9B9BA8',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#173D2C',
  },
  badgeText: {
    color: '#67E8A5',
    fontSize: 11,
    fontWeight: '700',
  },
  allocationBar: {
    height: 12,
    width: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 999,
  },
  assetList: {
    gap: 12,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assetName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  previewNote: {
    color: '#B9BAC4',
    fontSize: 12,
    lineHeight: 18,
  },
  connect: {
    justifyContent: 'flex-end',
  },
})