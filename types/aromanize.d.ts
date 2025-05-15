 declare module 'aromanize' {
    export function romanize(korean: string): string;
    
    const exported: {
        romanize: (korean: string) => string;
    };
    
    export default exported;
}