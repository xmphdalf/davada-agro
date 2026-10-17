/**
 * Runs before first paint (inlined in the layout) so a saved choice never flashes the other theme.
 * No saved choice = follow the device, as the prototype does.
 */
export const THEME_SCRIPT = `try{var t=localStorage.getItem('de-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`
