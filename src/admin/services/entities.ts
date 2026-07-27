import type {
  ContactRequest,
  ContactRequestInput,
  GalleryImage,
  GalleryImageInput,
  MediaFile,
  MediaFileInput,
  Project,
  ProjectInput,
  Service,
  ServiceInput,
  Testimonial,
  TestimonialInput,
} from '../types';
import { createRepository } from './repository';
import {
  seedContacts,
  seedGallery,
  seedMedia,
  seedProjects,
  seedServices,
  seedTestimonials,
} from './seed';

export const servicesService = createRepository<Service, ServiceInput>(
  'services',
  seedServices,
  'svc-'
);

export const projectsService = createRepository<Project, ProjectInput>(
  'projects',
  seedProjects,
  'prj-'
);

export const galleryService = createRepository<GalleryImage, GalleryImageInput>(
  'gallery',
  seedGallery,
  'gal-'
);

export const testimonialsService = createRepository<
  Testimonial,
  TestimonialInput
>('testimonials', seedTestimonials, 'tst-');

export const contactsService = createRepository<
  ContactRequest,
  ContactRequestInput
>('contacts', seedContacts, 'ctc-');

export const mediaService = createRepository<MediaFile, MediaFileInput>(
  'media',
  seedMedia,
  'med-'
);
