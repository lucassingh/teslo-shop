# Teslo Shop

Teslo shop is a clone of Tesla shop. Developed with the MERN stack.
We used Material UI + NEXT JS for the frontend and Node js + mongo DB for the backend. 
It is a list of products separated by categories with a shopping cart with a payment platform using paypal with stripe.
It also has authentication to create purchase orders and different user roles (admin - user).

## Home view

![teslo-home](https://user-images.githubusercontent.com/25686886/206232806-3ddae6ed-7aec-46d9-a7c4-323df8950fd9.png)

## Detail product view

![teslo-detail-prod](https://user-images.githubusercontent.com/25686886/206233181-1cad78ad-ed63-4fb5-9a88-f71f8375bd6a.png)

## Auth View

![teslo-auth](https://user-images.githubusercontent.com/25686886/206232864-0872bcb1-ec9d-4c65-b0fc-d5eb16988014.png)

## Cart view

![teslo-cart](https://user-images.githubusercontent.com/25686886/206232938-de175850-86ec-4ea7-9220-aae08b0e5e5e.png)

## Payment View

![teslo-detail-pay](https://user-images.githubusercontent.com/25686886/206233061-8df9b045-883b-44cd-b6cc-7c1ed498d46e.png)


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Teslo SHop

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

##Correr DB

```
docker-compose up -d

```

##mongodb URL local

```
mongodb://localhost:27017/teslodb

```

```
MONGO_URL=mongodb://localhost:27017/teslodb

```

##LLenar base de datos con info de pruebas

```
http://localhost:3000/api/seed

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
