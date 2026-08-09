import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ChurchPublicProfilePage({
  params,
}: {
  params: { "church-slug": string };
}) {
  const adminClient = createAdminClient();
  
  const { data: church, error: churchError } = await adminClient
    .from("churches")
    .select("*")
    .eq("slug", params["church-slug"])
    .maybeSingle();

  if (churchError || !church) {
    notFound();
  }

  // Fetch all published conferences for this church
  const { data: conferences, error: confError } = await adminClient
    .from("conferences")
    .select("*")
    .eq("church_id", church.id)
    .eq("status", "published")
    .order("conference_date", { ascending: true }); // Ideally filter out past ones or sort them appropriately

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Church Header Banner */}
      <div className="relative w-full h-64 md:h-80 bg-slate-900 overflow-hidden">
        {church.banner_url ? (
          <Image
            src={church.banner_url}
            alt={church.name}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Church Profile Info */}
      <div className="container relative -mt-20 z-10 mb-16">
        <div className="flex flex-col md:flex-row gap-6 md:items-end">
          {church.logo_url ? (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-50 bg-white overflow-hidden shadow-xl flex-shrink-0">
              <Image src={church.logo_url} alt={church.name} width={160} height={160} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-50 bg-primary/10 flex items-center justify-center shadow-xl flex-shrink-0">
              <span className="text-4xl font-bold text-primary">{church.name.charAt(0)}</span>
            </div>
          )}
          
          <div className="pb-2 space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-slate-900">{church.name}</h1>
            <p className="text-slate-600 max-w-2xl text-lg">{church.bio || "Welcome to our digital home. Join our upcoming online conferences."}</p>
          </div>
        </div>
      </div>

      {/* Conferences List */}
      <div className="container pb-24">
        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-8">Our Conferences</h2>
        
        {conferences && conferences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {conferences.map((conf: any) => (
              <Link href={`/c/${church.slug}/${conf.slug}`} key={conf.id} className="group">
                <Card className="h-full overflow-hidden border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {conf.banner_url ? (
                      <Image 
                        src={conf.banner_url} 
                        alt={conf.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100" />
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm border-none shadow-sm">
                        {conf.theme || "General"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {conf.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2 font-medium text-slate-600">
                      {new Date(conf.conference_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500 text-sm line-clamp-3">
                      {conf.caption || "Join us for this special event online."}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No conferences scheduled yet</h3>
            <p className="text-slate-500">Check back later for upcoming events from {church.name}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
