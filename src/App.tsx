import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { abi } from './abi'
import { parseEther } from 'viem'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error:errorConnect } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: hash, error, isPending, writeContract } = useWriteContract()

  async function withdraw(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const amount = formData.get('amount') as string
    writeContract({
      address: '0x69D349E2009Af35206EFc3937BaD6817424729F7',
      abi,
      functionName: 'withdraw',
      args: [parseEther(amount)],
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
        <h2>Unwrap</h2>
        <form onSubmit={withdraw}>
          <input name="amount" type="number" defaultValue="0.1" step="0.1" required />
          <button disabled={isPending} type="submit">{isPending ? 'Confirming...' : 'Unwrap'}</button>
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
