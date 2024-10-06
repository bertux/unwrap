import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { abi } from './abi'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error:errorConnect } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: hash, error, isPending, writeContract } = useWriteContract()

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const address = formData.get('address') as `0x${string}`
    const amount = formData.get('amount') as string
        writeContract({
      address: '0x24a3F04F70B7f07B9673EadD3e146391BcfEa5c1',
      abi,
      functionName: 'transfer',
      args: [address,BigInt(amount)],
    })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{errorConnect?.message}</div>
      </div>

      <div>
        <h2>Pay</h2>
        <form onSubmit={submit}>
          <input name="address" defaultValue="0x31c78ca321f6bbbd86f6fedf15b3ae9da808ee90" required />
          <input name="amount" type="number" placeholder="amount" required />
          <button disabled={isPending} type="submit">{isPending ? 'Confirming...' : 'Pay'}</button>
          {hash && <div>Transaction Hash: {hash}</div>}
          {isConfirming && <div>Waiting for confirmation...</div>}
          {isConfirmed && <div>Transaction confirmed.</div>}
          {error && (
            <div>Error: {(error as BaseError).shortMessage || error.message}</div>
          )}
        </form>
      </div>
    </>
  )
}

export default App
