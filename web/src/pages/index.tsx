import Image from 'next/image'

import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'

import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');

   async function handleCreatePool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('pools', {
        title: poolTitle,
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert(`Bolão criado com sucesso, o código foi criado para a área de transferència! ${code}`)

      setPoolTitle('')
    } catch (err) {
      console.log(err)
      alert('Falha ao criar o bolão, tente novamente!')
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto py-16 grid grid-cols-2 items-center gap-28 max-[1124px]:mx-6 max-[1024px]:gap-10 max-[768px]:grid-cols-1 max-[768px]:text-center max-[768px]:py-10">
      <main>
        <Image 
          className="h-10 max-[768px]:w-full max-[768px]:h-8"
          src={logoImg} 
          alt="Logo da NLW Copa" 
        />

        <h1 className="mt-[3.75rem] text-white text-5xl font-bold leading-tight max-[768px]:text-2xl">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="my-10 flex items-center gap-2 max-[768px]:justify-center">
          <Image 
            className="max-[768px]:w-28"
            src={usersAvatarExampleImg} 
            alt="Avatares dos participantes dos bolões" 
          />
          <strong className="text-gray-100 text-xl font-bold max-[768px]:text-sm">
            <span className="text-ignite-500">+{userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={handleCreatePool}>
          <div className="flex gap-2 max-[500px]:flex-col">
            <input 
              className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
              type="text" 
              required
              placeholder="Qual nome do seu bolão?" 
              onChange={event => setPoolTitle(event.target.value)}
              value={poolTitle}
            />
            <button 
              className="bg-yellow-500 px-6 py-4 rounded text-gray-900 text-sm font-bold uppercase hover:bg-yellow-700"
              type="submit"
            >
              Criar um bolão
            </button>
          </div>
          <footer className="mt-4 text-gray-300 text-sm leading-relaxed">
            Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas🚀
          </footer>
        </form>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100 max-[768px]:justify-evenly max-[500px]:justify-between max-[768px]:flex-col max-[768px]:gap-8 max-[768px]:pt-8">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col items-start gap-[2px]">
              <span className="text-2xl font-bold">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600 max-[768px]:w-full max-[768px]:h-px" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col items-start gap-[2px]">
              <span className="text-2xl font-bold">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image 
        className="max-[768px]:hidden"
        src={appPreviewImg} 
        alt="Dois celulares exibindo uma prévia da aplicação mobile desenvolvida na NLW Copa" 
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [
    poolCountResponse, 
    guessCountResponse, 
    userCountResponse
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}