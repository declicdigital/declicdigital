/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Reinitialisation de votre mot de passe pour {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reinitialiser votre mot de passe</Heading>
        <Text style={text}>
          Nous avons recu une demande de reinitialisation de mot de passe pour
          votre compte {siteName}. Cliquez sur le bouton ci-dessous pour choisir
          un nouveau mot de passe.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Reinitialiser le mot de passe
        </Button>
        <Text style={footer}>
          Si vous n'avez pas demande cette reinitialisation, ignorez cet email.
          Votre mot de passe ne sera pas modifie.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '20px 25px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: 'hsl(220, 25%, 10%)',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: 'hsl(220, 10%, 46%)',
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const button = {
  backgroundColor: 'hsl(199, 89%, 48%)',
  color: '#ffffff',
  fontSize: '14px',
  borderRadius: '0.75rem',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
