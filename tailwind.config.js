/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
      './index.html',
      './src/**/*.{js,jsx}',
    ],
    theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	fontFamily: {
    		sans: [
    			'Open Sans',
    			'sans-serif'
    		],
    		urbanist: [
    			'Urbanist',
    			'sans-serif'
    		]
    	},
    	extend: {
    		colors: {
    			'primary-blue': 'rgb(146, 179, 202)',
    			'primary-orange': 'rgb(243, 195, 177)',
    			'main-text': 'rgb(18, 18, 18)',
    			'error-red': 'rgb(208, 69, 82)',
    			'chatbot-bg': '#25003E',
    			'message-purple': 'rgb(162, 132, 206)',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
				
				color1:	'#1e1e1e',
				color2:	'#252526',
				color3:	'#2d2d30',
				color4:	'#3e3e42',
				color5:	'#007acc',
				
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		animation: {
    			spinner: 'spinner 1.5s linear infinite',
    			'spinner-delayed': 'spinner 1.5s linear infinite 0.75s'
    		},
    		keyframes: {
    			spinner: {
    				'0%': {
    					transform: 'scale(0)',
    					opacity: 1
    				},
    				'100%': {
    					transform: 'scale(1)',
    					opacity: 0
    				}
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
  };