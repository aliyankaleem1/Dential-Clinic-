import { LitElement } from 'lit';
export type LoadingType = 'auto' | 'lazy' | 'eager';
export type EventsTargetType = 'local' | 'global';
export type RendererType = 'auto' | 'webgpu' | 'webgl' | 'webgl2';
export type HintType = 'drag';
export type PreloaderAnimType = 'spinner-small-dark' | 'spinner-small-light' | 'spinner-big-dark' | 'spinner-big-light';
/**
 * Spline scene viewer
 */
export declare class SplineViewer extends LitElement {
    static styles: import("lit").CSSResult;
    /**
     * The url of the .splinecode file as exported from Spline Editor.
     */
    url: string | null;
    /**
     * The width of the canvas
     */
    width: number | undefined;
    /**
     * The height of the canvas
     */
    height: number | undefined;
    /**
     * Background color
     */
    background: string | undefined;
    /**
     * Rendering engine. 'auto' (default) lets the runtime pick: WebGPU
     * wherever the browser provides it (honoring the Renderer setting the
     * scene was exported with), WebGL everywhere else. 'webgpu' / 'webgl'
     * force one engine ('webgl2' is accepted as an alias of 'webgl'). The
     * engine is fixed per canvas, so changing this after a scene loaded
     * rebuilds the canvas and reloads the scene.
     */
    renderer: RendererType;
    /**
     * Preloading strategy ('auto', 'lazy' or 'eager')
     */
    loading: LoadingType;
    /**
     * Enables auto unloading of the canvas / spline when it leaves the viewport
     */
    unloadable: boolean;
    /**
     * Target of the mouse events, can either be 'local' (ie the canvas) or global (window)
     */
    eventsTarget: EventsTargetType | undefined;
    /**
     * Target of the mouse events, can either be 'local' (ie the canvas) or global (window)
     */
    hint?: boolean;
    /**
     * @deprecated Use loading-anim-type instead
     * When true it displays the spinner preloader.
     */
    loadingAnim: boolean;
    /**
     * Type of spinner preloader, can be 'spinner-small-dark', 'spinner-small-light' ,'spinner-big-dark', 'spinner-big-light' or undefined
     */
    loadingAnimType?: PreloaderAnimType;
    private _spline?;
    protected _intersectionObserver: IntersectionObserver | null;
    protected _isElementInViewport: boolean;
    protected _loaded: boolean;
    protected _container: HTMLElement;
    protected _canvas: HTMLCanvasElement;
    protected _logo: HTMLElement;
    protected _hintDrag: HTMLElement;
    protected _preloader: HTMLElement;
    protected _spinner: HTMLElement;
    protected _slot: HTMLElement;
    private _loadedUrl;
    private _wasContextLost;
    constructor();
    private rerender;
    /**
     * The engine the `renderer` attribute asks for ('auto' → undefined),
     * checked against the engine(s) compiled into this build. The
     * single-engine builds (spline-viewer.webgl.js / spline-viewer.webgpu.js)
     * don't contain the other engine at all, so there a mismatched request is
     * ignored with a console warning and the runtime's own selection runs.
     */
    private _resolveRenderer;
    /**
     * Creates the runtime Application for the current canvas, honoring the
     * `renderer` attribute. 'auto' passes no option so the runtime
     * auto-selects the engine (and the `?renderer=` URL diagnostic override
     * keeps working).
     */
    private _createApplication;
    protected unload(): void;
    protected _handleContextLost: () => void;
    protected _handleContextRestored: () => void;
    protected recreateCanvas(): void;
    protected load(): void;
    protected onLoaded: () => void;
    protected onInteract: () => void;
    updated(changedProperties: Map<string | number | symbol, any>): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'spline-viewer': SplineViewer;
    }
}
