import React from 'react'

import Toolbar from '@/components/Toolbar'

import styles from './Layout.module.css'

interface Props {
  children: any
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Toolbar />

      { children }
    </>
  )
}
