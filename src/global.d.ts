import 'tinymce';

declare global {
        const tinymce: typeof import('tinymce').default;
        const google: typeof import('google-one-tap');
}
