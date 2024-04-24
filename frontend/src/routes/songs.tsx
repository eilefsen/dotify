import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/songs')({
  component: () => <div>Hello /artist/songs!</div>
})