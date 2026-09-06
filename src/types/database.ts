export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      churches: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          banner_url: string | null;
          bio: string | null;
          denomination: string | null;
          tagline: string | null;
          year_founded: string | null;
          physical_address: string | null;
          state: string | null;
          town: string | null;
          country: string | null;
          timezone: string | null;
          admin_name: string | null;
          admin_email: string;
          instagram_url: string | null;
          facebook_url: string | null;
          youtube_url: string | null;
          whatsapp_url: string | null;
          whatsapp_channel_url: string | null;
          whatsapp_group_url: string | null;
          whatsapp_number: string | null;
          telegram_url: string | null;
          tiktok_url: string | null;
          threads_url: string | null;
          x_url: string | null;
          theme_preference: string | null;
          status: string | null;
          onboarding_token: string | null;
          onboarding_completed: boolean | null;
          invited_at: string | null;
          created_at: string | null;
          motto: string | null;
          mission_vision: string | null;
          alternate_email: string | null;
          address_line1: string | null;
          address_line2: string | null;
          admin_role: string | null;
          max_conferences_limit: number | null;
          max_emails_limit: number | null;
          phone_number: string | null;
          church_website_url: string | null;
          onboarding_tour_completed: boolean | null;
          is_premium: boolean | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          denomination?: string | null;
          tagline?: string | null;
          year_founded?: string | null;
          physical_address?: string | null;
          state?: string | null;
          town?: string | null;
          country?: string | null;
          timezone?: string | null;
          admin_name?: string | null;
          admin_email: string;
          instagram_url?: string | null;
          facebook_url?: string | null;
          youtube_url?: string | null;
          whatsapp_url?: string | null;
          whatsapp_channel_url?: string | null;
          whatsapp_group_url?: string | null;
          whatsapp_number?: string | null;
          telegram_url?: string | null;
          tiktok_url?: string | null;
          threads_url?: string | null;
          x_url?: string | null;
          theme_preference?: string | null;
          status?: string | null;
          onboarding_token?: string | null;
          onboarding_completed?: boolean | null;
          invited_at?: string | null;
          created_at?: string | null;
          motto?: string | null;
          mission_vision?: string | null;
          alternate_email?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          admin_role?: string | null;
          max_conferences_limit?: number | null;
          max_emails_limit?: number | null;
          phone_number?: string | null;
          church_website_url?: string | null;
          onboarding_tour_completed?: boolean | null;
          is_premium?: boolean | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          denomination?: string | null;
          tagline?: string | null;
          year_founded?: string | null;
          physical_address?: string | null;
          state?: string | null;
          town?: string | null;
          country?: string | null;
          timezone?: string | null;
          admin_name?: string | null;
          admin_email?: string;
          instagram_url?: string | null;
          facebook_url?: string | null;
          youtube_url?: string | null;
          whatsapp_url?: string | null;
          whatsapp_channel_url?: string | null;
          whatsapp_group_url?: string | null;
          whatsapp_number?: string | null;
          telegram_url?: string | null;
          tiktok_url?: string | null;
          threads_url?: string | null;
          x_url?: string | null;
          theme_preference?: string | null;
          status?: string | null;
          onboarding_token?: string | null;
          onboarding_completed?: boolean | null;
          invited_at?: string | null;
          created_at?: string | null;
          motto?: string | null;
          mission_vision?: string | null;
          alternate_email?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          admin_role?: string | null;
          max_conferences_limit?: number | null;
          max_emails_limit?: number | null;
          phone_number?: string | null;
          church_website_url?: string | null;
          onboarding_tour_completed?: boolean | null;
          is_premium?: boolean | null;
        };
        Relationships: [];
      };
      conferences: {
        Row: {
          id: string;
          church_id: string | null;
          title: string;
          slug: string;
          caption: string | null;
          full_description: string | null;
          agenda: Json | null;
          speaker_name: string | null;
          speaker_role: string | null;
          speaker_bio: string | null;
          host_name: string | null;
          event_type: string | null;
          banner_url: string | null;
          stream_url: string | null;
          theme: string | null;
          conference_date: string | null;
          end_date: string | null;
          conference_time: string | null;
          timezone: string | null;
          enable_replay: boolean | null;
          free_resource_url: string | null;
          free_resource_name: string | null;
          whatsapp_group_url: string | null;
          whatsapp_channel_url: string | null;
          whatsapp_contact_number: string | null;
          short_url: string | null;
          custom_alias: string | null;
          flyer_layout: string | null;
          template_id: string | null;
          rsvp_limit: number | null;
          custom_short_link: string | null;
          status: string | null;
          og_title: string | null;
          og_description: string | null;
          social_captions: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          church_id?: string | null;
          title: string;
          slug: string;
          caption?: string | null;
          full_description?: string | null;
          agenda?: Json | null;
          speaker_name?: string | null;
          speaker_role?: string | null;
          speaker_bio?: string | null;
          host_name?: string | null;
          event_type?: string | null;
          banner_url?: string | null;
          stream_url?: string | null;
          theme?: string | null;
          conference_date?: string | null;
          end_date?: string | null;
          conference_time?: string | null;
          timezone?: string | null;
          enable_replay?: boolean | null;
          free_resource_url?: string | null;
          free_resource_name?: string | null;
          whatsapp_group_url?: string | null;
          whatsapp_channel_url?: string | null;
          whatsapp_contact_number?: string | null;
          short_url?: string | null;
          custom_alias?: string | null;
          flyer_layout?: string | null;
          template_id?: string | null;
          rsvp_limit?: number | null;
          custom_short_link?: string | null;
          status?: string | null;
          og_title?: string | null;
          og_description?: string | null;
          social_captions?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          church_id?: string | null;
          title?: string;
          slug?: string;
          caption?: string | null;
          full_description?: string | null;
          agenda?: Json | null;
          speaker_name?: string | null;
          speaker_role?: string | null;
          speaker_bio?: string | null;
          host_name?: string | null;
          event_type?: string | null;
          banner_url?: string | null;
          stream_url?: string | null;
          theme?: string | null;
          conference_date?: string | null;
          end_date?: string | null;
          conference_time?: string | null;
          timezone?: string | null;
          enable_replay?: boolean | null;
          free_resource_url?: string | null;
          free_resource_name?: string | null;
          whatsapp_group_url?: string | null;
          whatsapp_channel_url?: string | null;
          whatsapp_contact_number?: string | null;
          short_url?: string | null;
          custom_alias?: string | null;
          flyer_layout?: string | null;
          template_id?: string | null;
          rsvp_limit?: number | null;
          custom_short_link?: string | null;
          status?: string | null;
          og_title?: string | null;
          og_description?: string | null;
          social_captions?: Json | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "conferences_church_id_fkey";
            columns: ["church_id"];
            isOneToOne: false;
            referencedRelation: "churches";
            referencedColumns: ["id"];
          }
        ];
      };
      subscribers: {
        Row: {
          id: string;
          church_id: string | null;
          conference_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          emails_received: string[] | null;
          last_email_opened_at: string | null;
          unsubscribed: boolean | null;
          subscribed_at: string | null;
          reminder_7d_sent: boolean | null;
          reminder_24h_sent: boolean | null;
          replay_email_sent: boolean | null;
        };
        Insert: {
          id?: string;
          church_id?: string | null;
          conference_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          emails_received?: string[] | null;
          last_email_opened_at?: string | null;
          unsubscribed?: boolean | null;
          subscribed_at?: string | null;
          reminder_7d_sent?: boolean | null;
          reminder_24h_sent?: boolean | null;
          replay_email_sent?: boolean | null;
        };
        Update: {
          id?: string;
          church_id?: string | null;
          conference_id?: string | null;
          full_name?: string;
          email?: string;
          phone?: string | null;
          emails_received?: string[] | null;
          last_email_opened_at?: string | null;
          unsubscribed?: boolean | null;
          subscribed_at?: string | null;
          reminder_7d_sent?: boolean | null;
          reminder_24h_sent?: boolean | null;
          replay_email_sent?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscribers_church_id_fkey";
            columns: ["church_id"];
            isOneToOne: false;
            referencedRelation: "churches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscribers_conference_id_fkey";
            columns: ["conference_id"];
            isOneToOne: false;
            referencedRelation: "conferences";
            referencedColumns: ["id"];
          }
        ];
      };
      email_log: {
        Row: {
          id: string;
          church_id: string | null;
          subscriber_id: string | null;
          conference_id: string | null;
          email_type: string;
          subject: string | null;
          sent_at: string | null;
          opened: boolean | null;
          clicked: boolean | null;
          resend_email_id: string | null;
        };
        Insert: {
          id?: string;
          church_id?: string | null;
          subscriber_id?: string | null;
          conference_id?: string | null;
          email_type: string;
          subject?: string | null;
          sent_at?: string | null;
          opened?: boolean | null;
          clicked?: boolean | null;
          resend_email_id?: string | null;
        };
        Update: {
          id?: string;
          church_id?: string | null;
          subscriber_id?: string | null;
          conference_id?: string | null;
          email_type?: string;
          subject?: string | null;
          sent_at?: string | null;
          opened?: boolean | null;
          clicked?: boolean | null;
          resend_email_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "email_log_church_id_fkey";
            columns: ["church_id"];
            isOneToOne: false;
            referencedRelation: "churches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "email_log_conference_id_fkey";
            columns: ["conference_id"];
            isOneToOne: false;
            referencedRelation: "conferences";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "email_log_subscriber_id_fkey";
            columns: ["subscriber_id"];
            isOneToOne: false;
            referencedRelation: "subscribers";
            referencedColumns: ["id"];
          }
        ];
      };
      utm_clicks: {
        Row: {
          id: string;
          conference_id: string | null;
          church_id: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          clicked_at: string | null;
          converted: boolean | null;
        };
        Insert: {
          id?: string;
          conference_id?: string | null;
          church_id?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          clicked_at?: string | null;
          converted?: boolean | null;
        };
        Update: {
          id?: string;
          conference_id?: string | null;
          church_id?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          clicked_at?: string | null;
          converted?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "utm_clicks_church_id_fkey";
            columns: ["church_id"];
            isOneToOne: false;
            referencedRelation: "churches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "utm_clicks_conference_id_fkey";
            columns: ["conference_id"];
            isOneToOne: false;
            referencedRelation: "conferences";
            referencedColumns: ["id"];
          }
        ];
      };
      invites: {
        Row: {
          id: string;
          church_name: string | null;
          email: string | null;
          token: string | null;
          status: string | null;
          invited_at: string | null;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          church_name?: string | null;
          email?: string | null;
          token?: string | null;
          status?: string | null;
          invited_at?: string | null;
          accepted_at?: string | null;
        };
        Update: {
          id?: string;
          church_name?: string | null;
          email?: string | null;
          token?: string | null;
          status?: string | null;
          invited_at?: string | null;
          accepted_at?: string | null;
        };
        Relationships: [];
      };
      access_requests: {
        Row: {
          id: string;
          church_name: string;
          admin_name: string;
          email: string;
          phone: string | null;
          website: string | null;
          denomination: string | null;
          country: string | null;
          notes: string | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          church_name: string;
          admin_name: string;
          email: string;
          phone?: string | null;
          website?: string | null;
          denomination?: string | null;
          country?: string | null;
          notes?: string | null;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          church_name?: string;
          admin_name?: string;
          email?: string;
          phone?: string | null;
          website?: string | null;
          denomination?: string | null;
          country?: string | null;
          notes?: string | null;
          status?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      feedback_messages: {
        Row: {
          id: string;
          church_id: string | null;
          user_email: string;
          user_name: string | null;
          category: string | null;
          message: string;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          church_id?: string | null;
          user_email: string;
          user_name?: string | null;
          category?: string | null;
          message: string;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          church_id?: string | null;
          user_email?: string;
          user_name?: string | null;
          category?: string | null;
          message?: string;
          status?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      system_announcements: {
        Row: {
          id: string;
          title: string;
          message: string;
          target_audience: string | null;
          sent_by: string;
          sent_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          message: string;
          target_audience?: string | null;
          sent_by: string;
          sent_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          target_audience?: string | null;
          sent_by?: string;
          sent_at?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          church_id: string | null;
          type: string;
          title: string;
          message: string;
          action_url: string | null;
          read: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          church_id?: string | null;
          type: string;
          title: string;
          message: string;
          action_url?: string | null;
          read?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          church_id?: string | null;
          type?: string;
          title?: string;
          message?: string;
          action_url?: string | null;
          read?: boolean | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_church_id_fkey";
            columns: ["church_id"];
            isOneToOne: false;
            referencedRelation: "churches";
            referencedColumns: ["id"];
          }
        ];
      };
      auth_rate_limits: {
        Row: {
          id: string;
          identifier: string;
          action: string;
          requested_at: string;
        };
        Insert: {
          id?: string;
          identifier: string;
          action: string;
          requested_at?: string;
        };
        Update: {
          id?: string;
          identifier?: string;
          action?: string;
          requested_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
