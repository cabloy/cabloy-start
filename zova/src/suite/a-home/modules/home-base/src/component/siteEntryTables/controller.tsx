import { VCard, VCardText, VCardTitle, VCol, VRow, VTable } from 'vuetify/components';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

interface SiteEntry {
  site: 'Web' | 'Admin';
  href: string;
}

const siteEntries: SiteEntry[] = [
  { site: 'Web', href: 'http://localhost:7102/' },
  { site: 'Admin', href: 'http://localhost:7102/admin/' },
];

@Controller()
export class ControllerSiteEntryTables extends BeanControllerBase {
  protected render() {
    const locale = this.scope.locale;
    const siteLabels = {
      Web: locale.SiteWeb(),
      Admin: locale.SiteAdmin(),
    };
    const tables = [
      { title: locale.VonaIntegratedSsr(), entries: siteEntries },
      {
        title: locale.ZovaStandaloneSsr(),
        entries: siteEntries.map(entry => ({
          ...entry,
          href: entry.href.replace(':7102', ':9000'),
        })),
      },
    ];

    return (
      <VRow>
        {tables.map(table => (
          <VCol cols={12} md={6}>
            <VCard class="h-100" variant="flat">
              <VCardTitle>{table.title}</VCardTitle>
              <VCardText>
                <div class="overflow-x-auto">
                  <VTable class="w-100">
                    <thead>
                      <tr>
                        <th scope="col">{locale.SsrSite()}</th>
                        <th scope="col">{locale.Url()}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.entries.map(entry => (
                        <tr>
                          <th scope="row">{siteLabels[entry.site]}</th>
                          <td>
                            <a href={entry.href} rel="noreferrer">
                              {entry.href}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </VTable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        ))}
      </VRow>
    );
  }
}
