# Auto Boomgaard Dashboard

Een modern en responsief beheerderspaneel voor Auto Boomgaard autobedrijf, gebouwd met Next.js en ShadCN.

## Functionaliteiten

- 🔐 Authenticatie en gebruikersbeheer
- 📊 Dashboard met statistieken 
- 🚗 CRUD-operaties voor auto's
- 📸 Foto-upload functionaliteit
- 🔍 Uitgebreide zoek- en filterfuncties
- 📱 Volledig responsief ontwerp

## Technologiestack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Componenten**: [ShadCN](https://ui.shadcn.com/)
- **Grafieken**: [Recharts](https://recharts.org/)
- **Formuliervalidatie**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Pictogrammen**: [Lucide React](https://lucide.dev/)

## Aan de slag

### Vereisten

- Node.js 18.0.0 of hoger
- npm of yarn

### Installatie

1. Clone de repository:
```bash
git clone https://github.com/username/auto-boomgaard-dashboard.git
cd auto-boomgaard-dashboard
```

2. Installeer dependencies:
```bash
npm install
# of
yarn install
```

3. Start de ontwikkelingsserver:
```bash
npm run dev
# of
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in je browser.

## Projectstructuur

```
├── app/                # Next.js app directory
│   ├── components/     # UI en custom componenten
│   ├── dashboard/      # Dashboard pagina's
│   ├── data/           # Mock data
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functies
│   └── ...             # Andere pagina's en bestanden
├── public/             # Statische assets
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Features

### Authentication
- Login/registratiepagina
- Wachtwoord vergeten functionaliteit
- Gebruikersbeheer en -goedkeuring

### Dashboard
- Overzicht van belangrijke statistieken
- Grafieken voor verkoopcijfers
- Recent toegevoegde auto's

### Auto's beheren
- Overzicht van alle auto's met filteren en zoeken
- Detail pagina's voor individuele auto's
- Formulieren voor het toevoegen en bewerken van auto's
- Foto-upload functionaliteit

## API integratie

Het project is voorbereid om met een backend API te integreren. Momenteel worden mock-gegevens gebruikt uit `app/data/mockData.json`.

## Licentie

[MIT](LICENSE)