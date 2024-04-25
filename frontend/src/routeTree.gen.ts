/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SongsImport } from './routes/songs'
import { Route as LoginImport } from './routes/login'
import { Route as AdminImport } from './routes/admin'
import { Route as ArtistsIndexImport } from './routes/artists/index'
import { Route as AlbumsIndexImport } from './routes/albums/index'
import { Route as ArtistsArtistIdImport } from './routes/artists/$artistId'
import { Route as AlbumsAlbumIdImport } from './routes/albums/$albumId'
import { Route as AdminUploadImport } from './routes/admin/upload'
import { Route as AdminArtistsIndexImport } from './routes/admin/artists/index'
import { Route as AdminArtistsArtistIdImport } from './routes/admin/artists/$artistId'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const SongsRoute = SongsImport.update({
  path: '/songs',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AdminRoute = AdminImport.update({
  path: '/admin',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const ArtistsIndexRoute = ArtistsIndexImport.update({
  path: '/artists/',
  getParentRoute: () => rootRoute,
} as any)

const AlbumsIndexRoute = AlbumsIndexImport.update({
  path: '/albums/',
  getParentRoute: () => rootRoute,
} as any)

const ArtistsArtistIdRoute = ArtistsArtistIdImport.update({
  path: '/artists/$artistId',
  getParentRoute: () => rootRoute,
} as any)

const AlbumsAlbumIdRoute = AlbumsAlbumIdImport.update({
  path: '/albums/$albumId',
  getParentRoute: () => rootRoute,
} as any)

const AdminUploadRoute = AdminUploadImport.update({
  path: '/upload',
  getParentRoute: () => AdminRoute,
} as any)

const AdminArtistsIndexRoute = AdminArtistsIndexImport.update({
  path: '/artists/',
  getParentRoute: () => AdminRoute,
} as any)

const AdminArtistsArtistIdRoute = AdminArtistsArtistIdImport.update({
  path: '/artists/$artistId',
  getParentRoute: () => AdminRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/admin': {
      preLoaderRoute: typeof AdminImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/songs': {
      preLoaderRoute: typeof SongsImport
      parentRoute: typeof rootRoute
    }
    '/admin/upload': {
      preLoaderRoute: typeof AdminUploadImport
      parentRoute: typeof AdminImport
    }
    '/albums/$albumId': {
      preLoaderRoute: typeof AlbumsAlbumIdImport
      parentRoute: typeof rootRoute
    }
    '/artists/$artistId': {
      preLoaderRoute: typeof ArtistsArtistIdImport
      parentRoute: typeof rootRoute
    }
    '/albums/': {
      preLoaderRoute: typeof AlbumsIndexImport
      parentRoute: typeof rootRoute
    }
    '/artists/': {
      preLoaderRoute: typeof ArtistsIndexImport
      parentRoute: typeof rootRoute
    }
    '/admin/artists/$artistId': {
      preLoaderRoute: typeof AdminArtistsArtistIdImport
      parentRoute: typeof AdminImport
    }
    '/admin/artists/': {
      preLoaderRoute: typeof AdminArtistsIndexImport
      parentRoute: typeof AdminImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  AdminRoute.addChildren([
    AdminUploadRoute,
    AdminArtistsArtistIdRoute,
    AdminArtistsIndexRoute,
  ]),
  LoginRoute,
  SongsRoute,
  AlbumsAlbumIdRoute,
  ArtistsArtistIdRoute,
  AlbumsIndexRoute,
  ArtistsIndexRoute,
])

/* prettier-ignore-end */
